import { jsonResponse } from '@/lib/inquiry';
import { chatFailure, ensureChatSession, requireChatOrigin } from '@/lib/sales-chat-server';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    requireChatOrigin(request);
    const session = await ensureChatSession(request);
    return jsonResponse({ ready: true, ...session.result }, 200, session.cookie ? { 'Set-Cookie': session.cookie } : undefined);
  } catch (error) { return chatFailure(error); }
}
