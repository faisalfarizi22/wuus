import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('chat SQL isolates visitors, bounds sends, deduplicates and refuses stale or misbound replies', async () => {
  const db = new PGlite();
  const rpc = async (name, args = []) => (await db.query(`select public.${name}(${args.map((_,i) => `$${i+1}`).join(',')}) as result`, args)).rows[0].result;
  try {
    await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
    const migration = await readFile(new URL('../supabase/migrations/202610190001_website_chat.sql', import.meta.url), 'utf8');
    await db.exec(migration); await db.exec(migration);
    for (const role of ['anon','authenticated']) {
      await db.exec(`set role ${role}`);
      await assert.rejects(db.query('select * from public.wuus_chat_conversations'), /permission denied/);
      await assert.rejects(db.query('select * from public.wuus_chat_messages'), /permission denied/);
      await assert.rejects(db.query('select * from wuus_private.chat_sessions'), /permission denied/);
      await assert.rejects(rpc('admin_read_wuus_chat', [randomUUID()]), /permission denied/);
      await assert.rejects(rpc('wuus_chat_readiness'), /permission denied/);
      await db.exec('reset role');
    }
    await db.exec('set role service_role');
    assert.equal((await rpc('wuus_chat_readiness')).ready, true);
    const tokenA = 'a'.repeat(64), tokenB = 'b'.repeat(64), net = 'c'.repeat(64);
    const a = await rpc('create_wuus_chat', [tokenA, net]), b = await rpc('create_wuus_chat', [tokenB,net]);
    assert.notEqual(a.conversation.id,b.conversation.id);
    const requestId = randomUUID();
    const send = await rpc('submit_wuus_chat_message', [tokenA,net,requestId,'Saya punya katering.','2026-10-19']);
    assert.equal(send.outcome,'saved');
    assert.deepEqual(await rpc('submit_wuus_chat_message', [tokenA,net,requestId,'Saya punya katering.','2026-10-19']), { outcome: 'duplicate', messageId: send.messageId });
    assert.equal((await rpc('submit_wuus_chat_message', [tokenA,net,requestId,'Body berubah','2026-10-19'])).outcome,'conflict');
    const own = await rpc('read_wuus_chat',[tokenA,net]), other = await rpc('read_wuus_chat',[tokenB,net]);
    assert.equal(own.messages.length,1); assert.equal(other.messages.length,0); assert.equal(own.conversation.version,1);
    assert.equal((await rpc('read_wuus_chat',['d'.repeat(64),net])).outcome,'expired');
    await assert.rejects(rpc('submit_wuus_chat_message',[tokenA,net,randomUUID(),'x'.repeat(2001),'2026-10-19']), /Invalid input/);
    const newer = await rpc('submit_wuus_chat_message',[tokenA,net,randomUUID(),'Katalog menu dan pesanan.','2026-10-19']);
    const replyId = randomUUID();
    assert.equal((await rpc('reply_wuus_chat',[a.conversation.id,replyId,send.messageId,1,'Draft lama'])).outcome,'conflict');
    assert.equal((await rpc('reply_wuus_chat',[b.conversation.id,replyId,newer.messageId,2,'Salah tujuan'])).outcome,'conflict');
    const reply = await rpc('reply_wuus_chat',[a.conversation.id,replyId,newer.messageId,2,'Boleh, berapa jenis menu yang ingin ditampilkan?']);
    assert.equal(reply.outcome,'saved');
    assert.equal((await rpc('reply_wuus_chat',[a.conversation.id,replyId,newer.messageId,2,'Boleh, berapa jenis menu yang ingin ditampilkan?'])).outcome,'duplicate');
    assert.equal((await rpc('reply_wuus_chat',[a.conversation.id,randomUUID(),newer.messageId,3,'Balasan dobel'])).outcome,'conflict');
    const final = await rpc('read_wuus_chat',[tokenA,net]);
    assert.equal(final.messages.length,3); assert.equal(final.conversation.status,'replied'); assert.equal(final.conversation.version,3);
    for (let i=0;i<4;i++) assert.equal((await rpc('submit_wuus_chat_message',[tokenA,net,randomUUID(),`Lanjutan ${i}`,'2026-10-19'])).outcome,'saved');
    assert.equal((await rpc('submit_wuus_chat_message',[tokenA,net,randomUUID(),'Terlalu cepat','2026-10-19'])).outcome,'limited');
    // Creation uses a durable network quota, even across separate session tokens.
    for (let i=0;i<8;i++) assert.equal((await rpc('create_wuus_chat',[String(i).repeat(64),net])).outcome,'ok');
    assert.equal((await rpc('create_wuus_chat',['e'.repeat(64),net])).outcome,'limited');
    await db.exec('reset role');
    await db.exec(`update wuus_private.chat_sessions set expires_at=now()-interval '1 second' where token_hash='${tokenA}'`);
    await db.exec('set role service_role');
    assert.equal((await rpc('read_wuus_chat',[tokenA,net])).outcome,'expired');
  } finally { await db.close(); }
});
