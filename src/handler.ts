async function getTelegramTokenFromKV(): Promise<string> {
  const token = await telegram_kv.get('telegram_token')

  if (token === undefined) {
    throw new Error(`Could not fetch token from KV store.`)
  }

  return token
}

const maps = [
  {
    imageUrl: 'https://images.pexels.com/photos/1685650/pexels-photo-1685650.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=320&w=384',
    sourceUrl: 'https://www.pexels.com/photo/brown-mushroom-on-ground-1685650/',
    options: ['Carrot', 'Potato', 'Mushroom'],
    correctOptionId: 2,
  }
]

async function handleNextCommand (token: String, chat_id: ChatID) {
  const poll = maps[0]

  await Promise.all([
    fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: chat_id,
        photo: poll.imageUrl,
        caption: `Via Pexels.com (${poll.sourceUrl})`
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }),
    fetch(`https://api.telegram.org/bot${token}/sendPoll`, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: chat_id,
        question: `What is this?`,
        options: poll.options,
        correct_option_id: poll.correctOptionId,
        explanation: `🚩 The correct answer is "${poll.options[poll.correctOptionId]}"!`,
        type: 'quiz',
        protect_content: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  ])
}

async function sendWelcomeMessage (token: String, chat_id: ChatID) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    body: JSON.stringify({
      chat_id: chat_id,
      text: 'Welcome! Type /next to get a new flashcard.'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function handleRequest(request: Request): Promise<Response> {
  const token = await getTelegramTokenFromKV()
  const update = await request.json<WebhookUpdateInput>()

  if (update.message !== undefined) {
    switch (update.message.text) {
      case '/next':
        await handleNextCommand(token, update.message.chat.id)
        break
      case '/start':
      default:
        await sendWelcomeMessage(token, update.message.chat.id)
    }
  }

  return new Response('Hello telegram.')
}
