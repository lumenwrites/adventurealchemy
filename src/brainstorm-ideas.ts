import { chat } from './chatgpt'
import { shuffle, readText, readJson, saveJson, replacePlaceholders, saveText } from './utils'

async function combineSettings(movie1, movie2) {
  let combineSettings = readText('./data/messages/settings-combine.txt')
  combineSettings = replacePlaceholders(combineSettings, {
    '{{movie1}}': movie1.title,
    '{{movie2}}': movie2.title,
    '{{setting1}}': movie1.setting,
    '{{setting2}}': movie2.setting,
  })
  let combinedSettings = await chat(combineSettings)
  let response = readText('./data/response-templates/settings-combined.txt')
  response = replacePlaceholders(response, {
    '{{movie1}}': movie1.title,
    '{{movie2}}': movie2.title,
    '{{setting1}}': movie1.setting,
    '{{setting2}}': movie2.setting,
    '{{combinedSettings}}': combinedSettings.trim(),
  })
  return combinedSettings
}

async function subvertSetting(movie) {
  let subvertSetting = readText('./data/messages/setting-subvert.txt')
  subvertSetting = replacePlaceholders(subvertSetting, {
    '{{movie}}': movie.title,
    '{{setting}}': movie.setting,
  })
  let subvertedSetting = await chat(subvertSetting)
  return subvertedSetting
}

async function settingPlusPlot(movie1, movie2) {
  let combineSettingWithPlot = readText('./data/messages/settings-plus-plots.txt')
  combineSettingWithPlot = replacePlaceholders(combineSettingWithPlot, {
    '{{movie1}}': movie1.title,
    '{{movie2}}': movie2.title,
    '{{setting}}': movie1.setting,
    '{{objective}}': movie2.objective,
  })
  let settingWithPlot = await chat(combineSettingWithPlot)
  return settingWithPlot
}

export async function brainstormIdeas() {
  const movieDescriptions = readJson('./data/out/movie-descriptions.json')
  let brainstormedSettings = []
  let formattedText = ''
  let combinedSettings = ''
  let subvertedSettings = ''
  let settingsWithPlot = ''
  for (let i = 0; i < 10; i++) {
    const shuffledMovieDescriptions = shuffle(JSON.parse(JSON.stringify(movieDescriptions)))
    let combinedSettings = await combineSettings(shuffledMovieDescriptions[0], shuffledMovieDescriptions[1])
    combinedSettings = replacePlaceholders(combinedSettings, {
      'Combined setting': 'Setting'
    })
    let subvertedSetting = await subvertSetting(shuffledMovieDescriptions[0])
    subvertedSetting = replacePlaceholders(subvertedSetting, {
      'Subverted setting': 'Setting'
    })
    let settingWithPlot = await settingPlusPlot(shuffledMovieDescriptions[0], shuffledMovieDescriptions[1])
    brainstormedSettings.push({
      movie1: shuffledMovieDescriptions[0].title,
      movie2: shuffledMovieDescriptions[1].title,
      setting1: shuffledMovieDescriptions[0].setting,
      setting2: shuffledMovieDescriptions[1].setting,
      objective1: shuffledMovieDescriptions[0].objective,
      objective2: shuffledMovieDescriptions[1].objective,
      combinedSettings: combinedSettings.trim().replace(/[\n\r]/g, ''),
      subvertedSetting: subvertedSetting.trim().replace(/[\n\r]/g, ''),
      settingWithPlot: settingWithPlot.trim().replace(/[\n\r]/g, ''),
    })
    formattedText += `${combinedSettings}${subvertedSetting}${settingWithPlot}`
    combinedSettings += `${combinedSettings}`
    subvertedSettings += `${subvertedSetting}`
    settingsWithPlot += `${settingWithPlot}`
    saveJson(`./data/out/brainstormed-settings.json`, brainstormedSettings)
    saveText(`./data/out/brainstormed-settings.txt`, formattedText)
    saveText(`./data/out/brainstormed-settings-combined.txt`, combinedSettings)
    saveText(`./data/out/brainstormed-settings-subverted.txt`, subvertedSettings)
    saveText(`./data/out/brainstormed-settings-with-plot.txt`, settingsWithPlot)
  }
}
