export class ChatInputError extends Error { status = 400; }

export const CHAT_CONSENT_VERSION = '2026-10-19';
export const CHAT_COOKIE = 'wuus_chat';
export type ChatMessage = { id: string; role: 'visitor' | 'team'; body: string; created_at: string; reply_to: string | null };
export type ChatConversation = { id: string; version: number; status: 'waiting' | 'replied'; created_at: string; updated_at: string };
export type ChatThread = { conversation: ChatConversation; messages: ChatMessage[] };

function record(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ChatInputError('Pesan belum lengkap.');
  return value as Record<string, unknown>;
}
export function chatUuid(value: unknown) {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) throw new ChatInputError('Identitas pesan tidak valid. Muat ulang percakapan.');
  return value;
}
export function chatText(value: unknown) {
  if (typeof value !== 'string') throw new ChatInputError('Tuliskan pesan Anda terlebih dahulu.');
  const text = value.trim();
  if (!text || text.length > 2000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) throw new ChatInputError('Pesan perlu diisi, maksimal 2.000 karakter.');
  return text;
}
export function validateChatMessage(value: unknown) {
  const input = record(value);
  if (input.consent !== true) throw new ChatInputError('Setujui penyimpanan percakapan sebelum mengirim.');
  return { requestId: chatUuid(input.requestId), body: chatText(input.body), consentVersion: CHAT_CONSENT_VERSION };
}
export function validateChatReply(value: unknown) {
  const input = record(value);
  if (!Number.isSafeInteger(input.expectedVersion) || (input.expectedVersion as number) < 1) throw new ChatInputError('Perbarui percakapan sebelum membalas.');
  return { conversationId: chatUuid(input.conversationId), requestId: chatUuid(input.requestId), replyTo: chatUuid(input.replyTo), expectedVersion: input.expectedVersion as number, body: chatText(input.body) };
}
export function chatPage(value: string | null) {
  if (value !== null && !/^\d{1,5}$/.test(value)) throw new ChatInputError('Halaman tidak valid.');
  return Number(value ?? 0);
}
