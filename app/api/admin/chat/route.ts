import { jsonResponse, readJson } from '@/lib/inquiry';
import { requireOwner, serviceClient } from '@/lib/inquiry-server';
import { chatPage, chatUuid, validateChatReply } from '@/lib/sales-chat';
import { chatFailure, chatRpc, checkChatResult } from '@/lib/sales-chat-server';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    await requireOwner(request);
    const params = new URL(request.url).searchParams;
    if (params.has('id')) return jsonResponse(await chatRpc('admin_read_wuus_chat', { p_conversation_id: chatUuid(params.get('id')) }));
    const page = chatPage(params.get('page'));
    const { data, error } = await serviceClient().from('wuus_chat_conversations').select('id,version,status,created_at,updated_at').gt('version', 0).order('updated_at', { ascending: false }).order('id').range(page * 50, page * 50 + 50);
    if (error) throw new Error('Unavailable');
    return jsonResponse({ conversations: (data ?? []).slice(0, 50), hasMore: (data?.length ?? 0) > 50, page });
  } catch (error) { return chatFailure(error); }
}
export async function POST(request: Request) {
  try {
    await requireOwner(request);
    const input = validateChatReply(await readJson(request));
    return jsonResponse(checkChatResult(await chatRpc('reply_wuus_chat', { p_conversation_id: input.conversationId, p_request_id: input.requestId, p_reply_to: input.replyTo, p_expected_version: input.expectedVersion, p_body: input.body })));
  } catch (error) { return chatFailure(error); }
}
