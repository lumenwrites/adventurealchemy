import { chat } from './chatgpt'
import { shuffle, readText, readJson, saveJson, saveText, replacePlaceholders } from './utils'
import { developIdeas, developDetails } from './develop-ideas'
import { pitchIdeas } from './pitch-ideas'
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
  // await pitchIdeas(100)
  // await developIdeas(100)
  let summary = readText('./data/in/summary.txt')
  const developedIdeas = readJson('./data/out/developed-ideas.json')
  let developedDetailsAll = []
  let developedDetailsText = ''
  for (let idea of developedIdeas.slice(0,1)) {
    let summary = `## ${idea.summary}\n`
    summary += `**Pitch:** ${idea.pitch}\n`
    summary += `${idea.developedIdea}\n\n`
    let developedDetails = await developDetails(summary)
    developedDetailsAll.push({ ...idea, developedDetails })
    // developedDetailsText += `## ${idea.summary}\n`
    // developedDetailsText += `**Prompts:**\n${idea.prompts}\n`
    // developedDetailsText += `**Pitch:** ${idea.pitch}\n`
    // developedDetailsText += `${idea.developedIdea}\n\n`
    developedDetailsText += `${developedDetails}\n\n`
    developedDetailsText += '---\n\n'
    saveJson(`./data/out/developed-details.json`, developedDetailsAll)
    saveText(`./data/out/developed-details.md`, developedDetailsText)
  }
}

main()



