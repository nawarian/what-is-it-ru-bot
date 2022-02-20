declare var telegram_kv: { get: (name: string) => Promise<string|undefined> }

interface Chat {
  id: Number,
  type: String
}

interface Message {
  message_id: Number,
  date: Number,
  chat: Chat,
  text: String,
}

interface WebhookUpdateInput {
  update_id: Number,
  message: Message,
}
