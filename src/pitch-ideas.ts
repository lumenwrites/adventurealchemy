import { chat } from './chatgpt'
import {
  shuffle,
  readText,
  readJson,
  saveJson,
  replacePlaceholders,
  saveText,
  getRandomInt,
  getRandomPrompt,
  cleanup,
} from './utils'

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function generatePrompts() {
  // X meets Y
  if (getRandomInt(0, 5) === 0) {
    const movie1 = getRandomPrompt('./data/prompts/movies.txt')
    const movie2 = getRandomPrompt('./data/prompts/movies.txt')
    let promptsText = `"${movie1}" meets "${movie2}"\n`
    promptsText += `Combine the most interesting ideas from these two movies to create a new and exciting story that makes sense.`
    return promptsText
  }
  // Twist
  if (getRandomInt(0, 5) === 0) {
    const movie = getRandomPrompt('./data/prompts/movies.txt')
    let twists = [
      `Take the main goal the protagonist pursues in the movie "${movie}", and set it in an entirely different, unexpected setting. Adapt this goal to this new world to create a good story that makes sense in this setting.`,
      `Take the setting from the movie "${movie}", but change the objective so that the heroes pursue an entirely different goal`,
      `Take the core premise of the movie "${movie}", and reverse the roles of the protagonist and antagonist.`,
      `Take the core premise of the movie "${movie}", and reverse it, do the opposite, subvert the trope.`,
      // 'Take the movie idea, and describe what it would be like if it was set in an entirely different genre.',
      // 'Take the core premise of the movie and exaggerate it to the extreme.',
      // 'Take the core premise of the movie and replace one of its aspects with something unexpected, introduce a surprising contradiction, add seemingly incompatible element. Then modify the idea to make this new element make sense.',
    ]
    let promptsText = randomItem(twists)
    return promptsText
  }

  // CORE PROMPTS
  let corePrompts = []
  // Setting
  let setting = getRandomPrompt('./data/prompts/settings.txt')
  // Setting adjective
  if (getRandomInt(0, 3) === 0) {
    let settingAdjective = getRandomPrompt('./data/prompts/setting-adjectives.txt')
    setting = `${settingAdjective} ${setting}`
  }
  // Second setting
  if (getRandomInt(0, 3) === 0) {
    let setting2 = getRandomPrompt('./data/prompts/settings.txt')
    setting += ` + ${setting2}`
  }
  corePrompts.push(`Setting: ${setting}\n`)
  // Objective
  let objective = getRandomPrompt('./data/prompts/objectives.txt')
  let prefixes = ['', '', 'Help someone to', "Stop the villain who's trying to"]
  objective = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${objective.toLowerCase()}`
  objective = objective.trim() // remove the space in case the prefix is empty
  objective = `Objective: ${objective}\n`
  // Solve a problem instead
  if (getRandomInt(0, 3) === 0) {
    let problem = getRandomPrompt('./data/prompts/problems.txt')
    objective = `Problem: ${problem}\n`
  }
  corePrompts.push(objective)

  // EXTRA PROMPTS
  let extraPrompts = []
  // Inhabitants
  let inhabitants = getRandomPrompt('./data/prompts/inhabitants.txt')
  let characterPrefixes = ['Inhabitants of the setting', 'Featuring characters', 'Enemies']
  extraPrompts.push(`${randomItem(characterPrefixes)}: ${inhabitants}\n`)
  // Antagonist
  let antagonist = getRandomPrompt('./data/prompts/antagonists.txt')
  let motivation = getRandomPrompt('./data/prompts/antagonist-motivations.txt')
  extraPrompts.push(`Antagonist: ${antagonist} who wants to ${motivation}\n`)
  // Premises
  let premise = getRandomPrompt('./data/prompts/premises.txt')
  extraPrompts.push(`Premise: ${premise}\n`)
  // Movie
  const movie = getRandomPrompt('./data/prompts/movies.txt')
  extraPrompts.push(`Inspired by movie: "${movie}"\n`)
  // Complication
  let complication = getRandomPrompt('./data/prompts/complications.txt')
  extraPrompts.push(`Complication: ${complication}\n`)

  extraPrompts = shuffle(extraPrompts)
  extraPrompts = extraPrompts.slice(0, 1) // getRandomInt(1, 2))
  let prompts = corePrompts.concat(extraPrompts)
  let promptsText = prompts.map(p => p.trim()).join('\n')
  return promptsText
}

export async function pitchOneIdea() {
  let prompts = generatePrompts()
  let message = readText('./data/messages/brainstorm-ideas/pitch.txt')
  message = replacePlaceholders(message, {
    '{{prompts}}': prompts,
  })
  let response = await chat(message)
  let [pitch, summary] = response.split('Summary:')
  prompts = cleanup(prompts)
  pitch = cleanup(pitch)
  summary = cleanup(summary)
  return { prompts, summary, pitch }
}

export async function pitchOneClimax() {
  let prompts = generatePrompts()
  let message = readText('./data/messages/brainstorm-ideas/pitch-climax.txt')
  message = replacePlaceholders(message, {
    '{{prompts}}': prompts,
  })
  let response = await chat(message)
  let [pitch, summary] = response.split('Summary:')
  prompts = cleanup(prompts)
  pitch = cleanup(pitch)
  summary = cleanup(summary)
  return { prompts, summary, pitch }
}




// export async function pitchIdeas(num = 5) {
//   let pitches = []
//   let pitchesText = ''
//   for (let i = 0; i < num; i++) {
//     try {
//       const { prompts, promptsText, oneline } = generatePrompts()
//       let pitch = await pitchIdea(promptsText)
//       let [fullPitch, summary] = pitch.split('Summary:')
//       fullPitch = cleanup(fullPitch)
//       summary = cleanup(summary)
//       pitches.push({ prompts: promptsText, summary, pitch: fullPitch })
//       pitchesText += `## ${summary}\n`
//       pitchesText += `${promptsText.trim()}\n\n`
//       pitchesText += `${fullPitch} \n\n`
//       pitchesText += '---\n\n'
//       saveJson(`./data/out/pitches.json`, pitches)
//       saveText(`./data/out/pitches.txt`, pitchesText.trim())
//     } catch (e) {
//       console.log(e)
//     }
//   }
// }