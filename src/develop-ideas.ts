import { chat } from './chatgpt'
import {
  shuffle,
  readText,
  readJson,
  saveJson,
  replacePlaceholders,
  saveText,
  getRandomPrompt,
  getRandomInt,
  cleanup,
} from './utils'

export async function baseElements(pitch) {
  let message = readText('./data/messages/develop-ideas/base-elements.txt')
  let climax = getRandomPrompt('./data/prompts/climaxes.txt')

  message = replacePlaceholders(message, {
    '{{pitch}}': pitch,
    '{{climax}}': climax,
  })
  let response = await chat(message)
  // response = response.replace('**Climax:**', `**Climax (${climax}):**`)
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

export async function developDetails(summary) {
  let fullText = ''
  let climaxes = ''
  let locations = ''
  let characters = ''
  let challenges = ''
  let scenes = ''
  let storyRecap = ''
  let storyOutline = ''
  let detailedOutline = ''
  let saveTheCat = ''
  // Locations // don't need locations since they're included in climaxes/challenges
  // locations = await summaryToDetails(summary, './data/messages/develop-ideas/locations.txt')
  // locations = cleanup(locations)

  // Climax ideas
  let summaryNoClimaxes = summary.split('**Plot Twist')[0].trim() // **Climax
  // let climaxesInput = `${pitch}\n\n`
  let climaxesInput = `${summaryNoClimaxes}\n\n`
  // climaxesInput += `# Location ideas\n${ locations }\n\n`
  climaxesInput += `Here's a list of challenge types. Make one climax idea revolving around each challenge type:\n`
  let climaxChallenges = readText('./data/prompts/climaxes.txt')
  climaxChallenges = climaxChallenges.split('\n')
  climaxChallenges = shuffle(climaxChallenges).slice(0, 5)
  climaxChallenges = climaxChallenges.map((c, idx) => `${idx + 1}. ${c}`)
  climaxesInput += climaxChallenges.join('\n')
  climaxes = await summaryToDetails(climaxesInput, './data/messages/develop-ideas/brainstorm-climaxes.txt')
  climaxes = cleanup(climaxes)

  // Challenges
  let summaryNoChallenges = summary.split('**Antagonist')[0].trim() // **Challenge **Antagonist
  challenges = await summaryToDetails(summaryNoChallenges, './data/messages/develop-ideas/challenges.txt')
  challenges = cleanup(challenges)

  // Story
  // let storyRecapInput = summary.split('**Exciting')[0].trim()
  // storyRecap = await summaryToDetails(storyRecapInput, './data/messages/develop-ideas/story-recap.txt')
  // storyRecap = cleanup(storyRecap)
  // storyOutline = await summaryToDetails(storyRecapInput, './data/messages/develop-ideas/story-outline.txt')
  // storyOutline = cleanup(storyOutline)
  // saveTheCat = await summaryToDetails(storyRecapInput, './data/messages/develop-ideas/story-save-the-cat.txt')
  // saveTheCat = cleanup(saveTheCat)
  // detailedOutline = await summaryToDetails(storyRecapInput, './data/messages/develop-ideas/outline.txt') // fullText
  // detailedOutline = cleanup(detailedOutline)

  // // Characters
  characters = await summaryToDetails(summaryNoChallenges, './data/messages/develop-ideas/characters.txt')  // summary
  characters = cleanup(characters)

  // Scenes
  // let scenesInput = `${summary}\n\n# Outline\n${outline}\n`
  // scenes = await summaryToDetails(scenesInput, './data/messages/develop-ideas/outline-to-scenes.txt')
  // scenes = cleanup(scenes)

  // fullText += `${summary}\n\n`
  if (climaxes) fullText += `## Climax Ideas\n${climaxes}\n`
  if (challenges) fullText += `## Challenges\n${challenges}\n`
  if (storyRecap) fullText += `**Story Recap:**\n${storyRecap}\n`
  if (storyOutline) fullText += `**Story Outline:**\n${storyOutline}\n`
  if (detailedOutline) fullText += `**Detailed Outline:**\n${detailedOutline}\n`
  if (saveTheCat) fullText += `**Save the Cat:**\n${saveTheCat}\n`
  if (locations) fullText += `**Locations:**\n${locations}\n`
  if (characters) fullText += `## Characters\n${characters}\n`
  // if (scenes) fullText += `## Scenes\n${scenes}\n`

  return fullText
}

// async function developChallenges(summary) {
//   let message = readText('./data/messages/develop-ideas/challenges.txt')
//   let objectives = readText('./data/prompts/objectives.txt').split('\n')
//   objectives = shuffle(objectives).slice(0, 10)
//   message = replacePlaceholders(message, {
//     '{{summary}}': summary,
//     '{{challenges}}': objectives.join('\n'),
//   })
//   let response = await chat(message)
//   return response
// }

async function summaryToDetails(summary, messageFile) {
  let message = readText(messageFile)
  message = replacePlaceholders(message, {
    '{{summary}}': summary,
  })
  let response = await chat(message)
  return response
}
