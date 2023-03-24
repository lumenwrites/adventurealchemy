import { chat } from './chatgpt'
import { shuffle, readText, readJson, saveJson, saveText, replacePlaceholders, cleanup } from './utils'
import { baseElements, developIdeas, developDetails } from './develop-ideas'
import { pitchOneIdea, pitchOneClimax } from './pitch-ideas'
import * as dotenv from 'dotenv'
dotenv.config()

async function developFullPremises() {
  let { pitch, summary, prompts } = await pitchOneIdea()
  let developedBaseElements = await baseElements(pitch)
  let fullText = `# ${summary}\n`
  fullText += `**Prompts:**\n${prompts}\n`
  fullText += `**Pitch:**\n${pitch}\n`
  fullText += `## Base Elements\n`
  fullText += `${cleanup(developedBaseElements)}\n`

  let developDetailsInput = `**Pitch:**\n${pitch}\n${cleanup(developedBaseElements)}\n`
  let developedDetails = await developDetails(developDetailsInput)
  fullText += `${cleanup(developedDetails)}\n`
  return fullText
}

// Pitch ideas
async function main() {
  let fullText = ''
  for (let i = 0; i < 40; i++) {
    try {
      let developedFullPremise = await developFullPremises()
      fullText += developedFullPremise
      fullText += '\n---\n\n'
      saveText(`./data/out/full-adventure-premises-7.md`, fullText)
    } catch (e) {}
  }
}

// Adapt movies
// async function main() {
//   let prompt1 = readText('./data/messages/describe-movies/movie-base-elements.txt')
//   // let response1 = await chat(prompt1)
//   // saveText(`./data/out/response1.md`, response1)
//   let response1 = readText('./data/out/response.md')
//   let prompt2 = readText('./data/messages/describe-movies/movie-adapt.txt')
//   let response2 = await chat2(prompt1, response1, prompt2)
//   saveText(`./data/out/response2.md`, response2)
// }

// import { Configuration, OpenAIApi } from 'openai'

// export async function chat2(message1, response1, message2, n = 1) {
//   console.log('[Message1]\n', message1)
//   console.log('[Response1]\n', response1)
//   console.log('[Message2]\n', message2)
//   const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
//   })
//   const openai = new OpenAIApi(configuration)
//   try {
//     // https://platform.openai.com/docs/api-reference/chat/create?lang=node.js
//     const response = await openai.createChatCompletion({
//       // model: 'gpt-3.5-turbo',
//       model: 'gpt-4',
//       messages: [
//         { role: 'system', content: readText('./data/messages/system.txt') },
//         { role: 'user', content: message1 },
//         { role: 'assistant', content: response1 },
//         { role: 'user', content: message2 },
//       ],
//       n, // number of responses to return
//     })
//     console.log('[ChatGPT Response]', JSON.stringify(response.data, null, 2))
//     return response.data.choices[0].message.content
//   } catch (e) {
//     console.error('ERROR', e.response)
//   }
// }

// Develop details
// async function main() {
//   let summary = readText('./data/in/summary.txt')
//   let developedDetails = await developDetails(summary)
//   saveText(`./data/out/developed-details.md`, developedDetails)
// }

// async function main() {
//   // await pitchIdeas(100)
//   // await developIdeas(100)
//   let summary = readText('./data/in/summary.txt')
//   developDetails(summary)
// }

main()

// Start with climaxes
// async function developFullPremises() {
//   let doPitchClimax = Math.random() >= 0.5
//   let { pitch, summary, prompts } = doPitchClimax ? await pitchOneClimax() : await pitchOneIdea()
//   let baseElementsPrompt = ''
//   // baseElementsPrompt += `**Creative Writing Prompts:**\n${idea.prompts.trim()}\n` // do show it the prompts
//   baseElementsPrompt += doPitchClimax ? `**Adventure Climax Idea:**\n` : `**Adventure Idea Pitch:**\n`
//   baseElementsPrompt += `${pitch}\n`

//   let developedBaseElements = await baseElements(baseElementsPrompt)
//   let fullText = `# ${summary}\n`
//   fullText += `**Prompts:**\n${prompts}\n`
//   fullText += `${baseElementsPrompt}`
//   fullText += `${cleanup(developedBaseElements)}\n\n`

//   return fullText
// }

// Pitch climaxes
// async function main() {
//   let fullText = ''
//   for (let i = 0; i < 10; i++) {
//     let { prompts, summary, pitch } = await pitchOneClimax()
//     let pitchText = `## ${summary}\n`
//     pitchText += `## Prompts\n${prompts.trim()}\n`
//     pitchText += `## Climax\n${pitch}\n\n`
//     fullText += pitchText
//     fullText += '---\n\n'
//     saveText(`./data/out/climaxes.md`, fullText)
//   }
// }
