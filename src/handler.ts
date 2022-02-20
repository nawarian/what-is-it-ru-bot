async function getTelegramTokenFromKV(): Promise<string> {
  const token = await telegram_kv.get('telegram_token')

  if (token === undefined) {
    throw new Error(`Could not fetch token from KV store.`)
  }

  return token
}

export async function handleRequest(request: Request): Promise<Response> {
  const token = await getTelegramTokenFromKV()
  const update = await request.json<WebhookUpdateInput>()

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    body: JSON.stringify({
      chat_id: update.message.chat.id,
      text: `Hello telegram!`
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return new Response('Hello telegram.')
}
