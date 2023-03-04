import { chat } from './chatgpt'
import { shuffle, readText, readJson, saveJson, replacePlaceholders, saveText, cleanup } from './utils'

async function baseElements(pitch) {
  let message = readText('./data/messages/develop-ideas/base-elements.txt')
  message = replacePlaceholders(message, {
    '{{pitch}}': pitch,
  })
  let response = await chat(message)
  return response
}

export async function developIdeas(num = 5) {
  let pitches = readJson('./data/out/pitches.json')
  // pitches = shuffle(JSON.parse(JSON.stringify(pitches)))
  let developedIdeas = []
  let developedIdeasText = ''
  for (let pitchObj of pitches.slice(0, num)) {
    const pitch = pitchObj.pitch
    try {
      let developedIdea = await baseElements(pitch)
      developedIdea = cleanup(developedIdea)
      developedIdeas.push({ ...pitchObj, developedIdea })
      developedIdeasText += `## ${pitchObj.summary}\n`
      developedIdeasText += `**Prompts:**\n${pitchObj.prompts.trim()}\n`
      developedIdeasText += `**Pitch:** ${pitch}\n`
      developedIdeasText += `${developedIdea}\n\n`
      developedIdeasText += '---\n\n'
      saveJson(`./data/out/developed-ideas.json`, developedIdeas)
      saveText(`./data/out/developed-ideas.txt`, developedIdeasText)
    } catch (e) {}
  }
}


export async function developDetails() {
  let summary = readText('./data/in/summary.txt')
  let fullText = ''
  // fullText += `${summary}\n`
  // let locations = await summaryToDetails(summary, './data/messages/develop-ideas/locations.txt')
  // locations = cleanup(locations)
  // fullText += `## Locations\n${locations}\n\n`
  // let charactersSet1 = await summaryToDetails(summary, './data/messages/develop-ideas/characters.txt')
  // charactersSet1 = cleanup(charactersSet1)
  // fullText += `## Characters\n${charactersSet1}\n\n`
  // let charactersSet2 = await summaryToDetails(summary, './data/messages/develop-characters.txt')
  // fullText += `## Characters 2\n${charactersSet2}\n`
  let challenges = await developChallenges(summary)
  challenges = cleanup(challenges)
  fullText += `## Challenges\n${challenges}\n\n`

  // let outline = await summaryToDetails(fullText, './data/messages/develop-ideas/outline.txt')
  // outline = cleanup(outline)
  // fullText += `## Outline\n${outline}\n`
  saveText(`./data/out/developed-details.txt`, fullText)
}

async function developChallenges(summary) {
  let message = readText('./data/messages/develop-ideas/challenges.txt')
  let objectives = readText('./data/prompts/objectives.txt').split('\n')
  objectives = shuffle(objectives).slice(0, 10)
  message = replacePlaceholders(message, {
    '{{summary}}': summary,
    '{{challenges}}': objectives.join('\n'),
  })
  let response = await chat(message)
  return response
}

async function summaryToDetails(summary, messageFile) {
  let message = readText(messageFile)
  message = replacePlaceholders(message, {
    '{{summary}}': summary,
  })
  let response = await chat(message)
  return response
}

