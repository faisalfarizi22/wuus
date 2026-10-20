import { jsonResponse, readJson, RequestError } from '@/lib/inquiry';
import { validateChatMessage } from '@/lib/sales-chat';
import { chatFailure, chatRpc, chatToken, checkChatResult, networkDigest, requireChatOrigin, tokenDigest } from '@/lib/sales-chat-server';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    // Cross-site browser reads are blocked as well as writes. No public list exists.
    if (request.headers.get('sec-fetch-site') === 'cross-site') throw new RequestError('Permintaan tidak diizinkan.', 403);
    const token = chatToken(request);
    if (!token) { await chatRpc('wuus_chat_readiness'); return jsonResponse({ ready: true, conversation: null, messages: [] }); }
    return jsonResponse(checkChatResult(await chatRpc('read_wuus_chat', { p_token_hash: tokenDigest(token), p_network_key: networkDigest(request) })));
  } catch (error) { return chatFailure(error); }
}
export async function POST(request: Request) {
  try {
    requireChatOrigin(request);
    const input = validateChatMessage(await readJson(request));
    const token = chatToken(request);
    if (!token) throw new RequestError('Mulai percakapan kembali sebelum mengirim. Pesan Anda tetap ada.', 401);
    const result = checkChatResult(await chatRpc('submit_wuus_chat_message', { p_token_hash: tokenDigest(token), p_network_key: networkDigest(request), p_request_id: input.requestId, p_body: input.body, p_consent_version: input.consentVersion }));
    return jsonResponse(result, result.outcome === 'saved' ? 201 : 200);
  } catch (error) { return chatFailure(error); }
}
