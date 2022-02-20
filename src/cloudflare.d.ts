declare var telegram_kv: { get: (name: string) => Promise<string|undefined> }

type ChatID = Number

interface Chat {
  id: ChatID,
  type: String
}

interface Message {
  message_id: Number,
  date: Number,
  chat: Chat,
  text: String,
}

interface PollOption {
  text: String,
  voter_count: Number
}

interface Poll {
  type: 'quiz' | 'regular',
  options: PollOption[],
  correct_option_id: Number
}

interface WebhookUpdateInput {
  update_id: Number,
  message: Message|undefined,
  poll: Poll|undefined
}

interface TelegramApiResponse<T> {
  ok: Boolean,
  result: T
}
