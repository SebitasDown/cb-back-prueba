import ChatSession from "../models/ChatSession.js";
import ChatMessage from "../models/ChatMessage.js";

export async function createSession(userId, title = "Nueva conversación") {
  const session = await ChatSession.create({ userId, title });
  return session;
}

export async function getSessionsByUser(userId) {
  return ChatSession.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getSessionById(sessionId) {
  return ChatSession.findById(sessionId).lean();
}

export async function getRecentMessages(sessionId, limit = 20) {
  return ChatMessage.find({ sessionId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .lean();
}

export async function saveMessage(sessionId, userId, role, content) {
  const message = await ChatMessage.create({ sessionId, userId, role, content });
  return message;
}

export async function deleteOldMessages(sessionId, maxMessages = 50) {
  const count = await ChatMessage.countDocuments({ sessionId });
  if (count > maxMessages) {
    const excess = count - maxMessages;
    const oldest = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(excess)
      .select("_id");
    const ids = oldest.map((m) => m._id);
    await ChatMessage.deleteMany({ _id: { $in: ids } });
  }
}

export async function buildContext(sessionId, userId, systemPrompt) {
  const messages = await getRecentMessages(sessionId, 20);

  const context = [{ role: "system", content: systemPrompt }];

  for (const msg of messages) {
    context.push({ role: msg.role, content: msg.content });
  }

  return context;
}
