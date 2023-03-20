import { chat } from './chatgpt'
import { shuffle, readText, readJson, saveJson, saveText, replacePlaceholders, cleanup } from './utils'
import { baseElements, developIdeas, developDetails } from './develop-ideas'
import { pitchIdeas, pitchOneIdea, pitchOneClimax } from './pitch-ideas'
import * as dotenv from 'dotenv'
dotenv.config()

async function developFullPremises() {
  let fullText = ''
  let baseElementsPrompt = ''
  let idea
  if (Math.random() >= 0.5) {
    idea = await pitchOneIdea()
    baseElementsPrompt += `**Creative Writing Prompts:**\n${idea.prompts.trim()}\n`
    baseElementsPrompt += `**Adventure Idea Pitch:** \n${idea.pitch.trim()}\n`  
  } else {
    idea = await pitchOneClimax()
    baseElementsPrompt += `**Creative Writing Prompts:**\n${idea.prompts.trim()}\n`
    baseElementsPrompt += `**Adventure Climax Idea:** \n${idea.pitch.trim()}\n`
  }

  let developedBaseElements = await baseElements(baseElementsPrompt)
  fullText = `# ${idea.summary.trim()}\n`
  fullText += `${baseElementsPrompt}`
  fullText += `${cleanup(developedBaseElements)}\n\n`

  return fullText
}

async function main() {
  let fullText = ''
  for (let i = 0; i < 10; i++) {
    let developedFullPremise = await developFullPremises()
    fullText += developedFullPremise
    fullText += '---\n\n'
    saveText(`./data/out/full-adventure-premises.md`, fullText)
  }
}

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
