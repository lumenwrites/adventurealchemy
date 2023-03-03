import { Configuration, OpenAIApi } from 'openai'

export async function chat(message, n = 1) {
  console.log('[Sending message to ChatGPT]', message)
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)
  // https://platform.openai.com/docs/api-reference/chat/create?lang=node.js
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      // { role: 'system', content: getText('system') },
      { role: 'user', content: message },
    ],
    n, // number of responses to return
  })
  console.log('[ChatGPT Response]', JSON.stringify(response.data, null, 2))
  return response.data.choices[0].message.content
}