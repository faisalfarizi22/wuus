// Use the project's Node24 --env-file loader. Never print credentials or customer text.
import { createClient } from '@supabase/supabase-js';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chatUuid, validateChatReply } from '../lib/sales-chat.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function privateOutput(path) {
  if (!path || !isAbsolute(path)) throw new Error('Gunakan path output absolut di luar repository untuk data pelanggan.');
  const target = resolve(path), rel = relative(root, target);
  if (rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))) throw new Error('Data pelanggan tidak boleh disimpan di repository.');
  return target;
}
async function output(path, value) {
  const target = privateOutput(path);
  await mkdir(dirname(target), { recursive: true });
  // Preserve old context/receipts rather than overwriting them.
  await writeFile(target, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  return target;
}
async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Konfigurasi Supabase server belum tersedia. Jangan kirim kredensial ke chat.');
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15_000) }) } });
  const [command, ...args] = process.argv.slice(2);
  async function rpc(name, input = {}) { const { data, error } = await client.rpc(name, input); if (error) throw new Error('Chat belum siap atau layanan penyimpanan belum tersedia. Tidak ada kiriman yang diulang otomatis.'); return data; }
  if (command === 'status') {
    const ready = await rpc('wuus_chat_readiness');
    const { count, error } = await client.from('wuus_chat_conversations').select('id', { count: 'exact', head: true }).eq('status', 'waiting').gt('version', 0);
    if (error) throw new Error('Inbox belum tersedia.');
    console.log(JSON.stringify({ ready: ready.ready, waiting: count, mode: 'active-codex-session-only', outreach: 'off' }));
  } else if (command === 'list') {
    const { data, error } = await client.from('wuus_chat_conversations').select('id,version,status,created_at,updated_at').eq('status', 'waiting').gt('version', 0).order('updated_at').limit(100);
    if (error) throw new Error('Inbox belum tersedia.');
    const path = await output(args[0], { exportedAt: new Date().toISOString(), conversations: data });
    console.log(JSON.stringify({ count: data.length, path }));
  } else if (command === 'export') {
    const id = chatUuid(args[0]);
    const data = await rpc('admin_read_wuus_chat', { p_conversation_id: id });
    if (!data?.conversation) throw new Error('Percakapan tidak ditemukan.');
    const path = await output(args[1], { ...data, exportedAt: new Date().toISOString() });
    console.log(JSON.stringify({ conversationId: id, version: data.conversation.version, messages: data.messages.length, path }));
  } else if (command === 'reply') {
    if (args[1] !== '--send') throw new Error('Tinjau draft lalu gunakan reply ABSOLUTE_DRAFT_JSON --send. Perintah ini mengirim balasan ke chat pelanggan.');
    const input = validateChatReply(JSON.parse(await readFile(privateOutput(args[0]), 'utf8')));
    const result = await rpc('reply_wuus_chat', { p_conversation_id: input.conversationId, p_request_id: input.requestId, p_reply_to: input.replyTo, p_expected_version: input.expectedVersion, p_body: input.body });
    if (!['saved','duplicate'].includes(result?.outcome)) throw new Error(result?.outcome === 'conflict' ? 'Konteks berubah. Ekspor versi baru dan tinjau ulang sebelum membalas.' : 'Balasan belum disimpan. Periksa kesiapan percakapan.');
    // Receipt first. A failure writing the receipt is uncertain; retry the same requestId only.
    const receipt = { ...result, conversationId: input.conversationId, requestId: input.requestId, confirmedAt: new Date().toISOString(), delivery: 'stored-in-website-chat; read-not-confirmed' };
    const path = await output(`${args[0]}.receipt.json`, receipt);
    console.log(JSON.stringify({ ...receipt, path }));
  } else throw new Error('Gunakan status | list ABS_OUTPUT_JSON | export CONVERSATION_ID ABS_OUTPUT_JSON | reply ABS_DRAFT_JSON --send.');
}
run().catch(() => { console.error('Operasi chat belum berhasil dikonfirmasi. Periksa konfigurasi, SQL, path privat dan konteks percakapan. Untuk kiriman tidak pasti, periksa riwayat lalu gunakan requestId yang sama; jangan membuat kiriman baru.'); process.exitCode = 1; });
