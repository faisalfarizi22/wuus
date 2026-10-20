import test from 'node:test';
import assert from 'node:assert/strict';
import { validateChatMessage, validateChatReply, chatPage } from '../lib/sales-chat.ts';
const id = '5d3fe66a-4176-4b4f-bd83-3c6c2d3842c2';
test('visitor consent is explicit, messages bounded, IDs validated', () => {
  assert.deepEqual(validateChatMessage({ requestId: id, body: '  Halo WUUS  ', consent: true }), { requestId: id, body: 'Halo WUUS', consentVersion: '2026-10-19' });
  for (const changes of [{ consent: false }, { consent: 'true' }, { body: ' ' }, { body: 'x'.repeat(2001) }, { body: 'hello\u0001' }, { requestId: 'oops' }]) assert.throws(() => validateChatMessage({ requestId: id, body: 'Halo', consent: true, ...changes }));
});
test('replies require actual conversation, message and version, not a free text send', () => {
  const input = { conversationId: id, requestId: id, replyTo: id, expectedVersion: 1, body: 'Selamat siang.' };
  assert.deepEqual(validateChatReply(input), input);
  for (const changes of [{ expectedVersion: 0 }, { expectedVersion: 1.2 }, { expectedVersion: '1' }, { replyTo: undefined }, { conversationId: '../' }]) assert.throws(() => validateChatReply({ ...input, ...changes }));
  assert.equal(chatPage(null), 0); assert.equal(chatPage('12'), 12); assert.throws(() => chatPage('-1')); assert.throws(() => chatPage('1 OR 1=1'));
});
