import { chat } from './chatgpt'
import { shuffle, readText, readJson, saveJson, saveText, replacePlaceholders } from './utils'
import { describeMovies } from './describe-movies'
import { brainstormIdeas } from './brainstorm-ideas'
import * as dotenv from 'dotenv'
dotenv.config()

async function brainstormObjectives() {
  const brainstormedSettings = readJson('./data/out/brainstormed-settings-without-plots.json')
  const movieDescriptions = readJson('./data/out/movie-descriptions.json')
  const shuffledSettings = shuffle(JSON.parse(JSON.stringify(brainstormedSettings)))
  const shuffledMovieDescriptions = shuffle(JSON.parse(JSON.stringify(movieDescriptions)))
  const setting = `Setting (${shuffledSettings[0].movie1} meets ${
    shuffledSettings[0].movie2
  }): ${shuffledSettings[0].combinedSettings.split(':')[1].trim()}`
  const objective = `Objective (${shuffledMovieDescriptions[0].title}): ${shuffledMovieDescriptions[0].objective}`
  console.log(setting, '\n', objective)
}
async function main() {
  const movies = readText('./data/lists/movies.txt').split('\n')
  const shuffledMovies = shuffle(JSON.parse(JSON.stringify(movies)))
  const randomMovie1 = shuffledMovies[0]
  const randomMovie2 = shuffledMovies[1]
  const movieDescriptions = readJson('./data/out/movie-descriptions.json')
  const shuffledMovieDescriptions = shuffle(JSON.parse(JSON.stringify(movieDescriptions)))
  const randomDescription1 = shuffledMovieDescriptions[0]
  const randomDescription2 = shuffledMovieDescriptions[1]
  // settingPlusPlot(randomDescription1, randomDescription2)
  // const combinedSettings = await combineSettings(shuffledMovieDescriptions[0], shuffledMovieDescriptions[1])
  // const subvertedSetting = await subvertSetting(shuffledMovieDescriptions[0])
  // console.log(`${combinedSettings} \n ${subvertedSetting}`)
  // const brainstormedSettings = readJson('./data/out/brainstormed-settings.json')
  // const { title, setting } = shuffledMovieDescriptions[0]
  // const removedPlot = await removePlot(brainstormedSettings[1].combinedSettings)
  // console.log(brainstormedSettings[1].combinedSettings, removedPlot)
  // console.log(`${title}\n${setting}\n${removedPlot}`);
}

function formatMovieDescriptions() {
  const movieDescriptions = readJson('./data/out/movie-descriptions.json')
  let descriptions = ''
  let settings = ''
  let objectives = ''
  let climaxes = ''
  for (let movieDescription of movieDescriptions) {
    descriptions += `${movieDescription.title}\nSetting\n${movieDescription.setting}\nObjective\n${movieDescription.objective}\nClimax\n${movieDescription.climax}\n\n`
    settings += `${movieDescription.title}\n${movieDescription.setting}\n\n`
    objectives += `${movieDescription.title}\n${movieDescription.objective}\n\n`
    climaxes += `${movieDescription.title}\n${movieDescription.climax}\n\n`
  }
  saveText('./data/out/descriptions.txt', descriptions)
  saveText('./data/out/descriptions-settings.txt', settings)
  saveText('./data/out/descriptions-objectives.txt', objectives)
  saveText('./data/out/descriptions-climaxes.txt', climaxes)
}
formatMovieDescriptions()

// describeMovies()
// brainstormIdeas()
// brainstormObjectives()
// main()




async function removePlot(setting) {
  let removePlot = readText('./data/messages/settings-remove-plots.txt')
  removePlot = replacePlaceholders(removePlot, {
    '{{setting}}': setting,
  })
  let removedPlot = await chat(removePlot)
  return removedPlot
}

async function removePlots() {
  const brainstormedSettings = readJson('./data/out/brainstormed-settings.json')
  let brainstormedSettingsWithoutPlots = []
  for (let brainstormedSetting of brainstormedSettings) {
    brainstormedSettingsWithoutPlots.push({
      movie1: brainstormedSetting.movie1,
      movie2: brainstormedSetting.movie2,
      setting1: await removePlot(brainstormedSetting.setting1),
      setting2: await removePlot(brainstormedSetting.setting2),
      combinedSettings: await removePlot(brainstormedSetting.combinedSettings),
      subvertedSetting: await removePlot(brainstormedSetting.subvertedSetting),
    })
    saveJson(`./data/out/brainstormed-settings-without-plots.json`, brainstormedSettingsWithoutPlots)
  }
}

// removePlots()
