import 'server-only';
import { createHash, createHmac, randomBytes } from 'node:crypto';
import { isIP } from 'node:net';
import { allowedOrigin, inquiryConfigured, serviceClient } from './inquiry-server';
import { jsonResponse, RequestError } from './inquiry';
import { CHAT_COOKIE, ChatInputError } from './sales-chat';

export function requireChatOrigin(request: Request) {
  if (!allowedOrigin(request.headers.get('origin'))) throw new RequestError('Permintaan tidak diizinkan.', 403);
}
export function chatToken(request: Request) {
  const value = request.headers.get('cookie')?.split(';').map(item => item.trim()).find(item => item.startsWith(`${CHAT_COOKIE}=`))?.slice(CHAT_COOKIE.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : undefined;
}
export const tokenDigest = (token: string) => createHash('sha256').update(token).digest('hex');
export function networkDigest(request: Request) {
  const candidate = process.env.VERCEL === '1' ? request.headers.get('x-vercel-forwarded-for')?.trim() : undefined;
  return createHmac('sha256', process.env.WUUS_RATE_LIMIT_SECRET!).update(candidate && isIP(candidate) ? candidate : 'unavailable').digest('hex');
}
export async function chatRpc(name: string, input: Record<string, unknown> = {}) {
  if (!inquiryConfigured()) throw new RequestError('Chat belum tersedia. Pesan Anda tetap ada di kolom ini; silakan hubungi kami melalui WhatsApp.', 503);
  const { data, error } = await serviceClient().rpc(name, input);
  if (error) throw new RequestError('Chat sedang belum dapat diakses. Pesan Anda tetap ada; coba lagi atau hubungi WhatsApp WUUS.', 503);
  return data;
}
export function checkChatResult(result: { outcome?: string }) {
  const messages: Record<string, [string, number]> = {
    limited: ['Pesan cukup banyak dalam waktu singkat. Tunggu sebentar sebelum mencoba lagi.', 429],
    expired: ['Percakapan ini sudah berakhir. Salin pesan Anda dan hubungi WhatsApp WUUS.', 410],
    conflict: ['Percakapan berubah. Perbarui pesan dan periksa kembali sebelum membalas.', 409],
    full: ['Percakapan ini sudah penuh. Lanjutkan melalui WhatsApp WUUS.', 409],
  };
  const failure = messages[result.outcome ?? ''];
  if (failure) throw new RequestError(...failure);
  return result;
}
export function chatFailure(error: unknown) {
  return error instanceof RequestError || error instanceof ChatInputError ? jsonResponse({ error: error.message }, error.status, error.status === 429 ? { 'Retry-After': '60' } : undefined)
    : jsonResponse({ error: 'Pesan belum dapat dipastikan tersimpan. Coba lagi dengan pesan yang sama; jangan tutup percakapan ini.' }, 503);
}
export async function ensureChatSession(request: Request) {
  const existing = chatToken(request);
  if (existing) {
    const result = await chatRpc('read_wuus_chat', { p_token_hash: tokenDigest(existing), p_network_key: networkDigest(request) });
    if (result?.outcome === 'ok') return { existing: true, result };
    checkChatResult(result);
  }
  const token = randomBytes(32).toString('hex');
  const result = checkChatResult(await chatRpc('create_wuus_chat', { p_token_hash: tokenDigest(token), p_network_key: networkDigest(request) }));
  return { existing: false, result, cookie: `${CHAT_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/api/chat; Max-Age=604800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}` };
}
