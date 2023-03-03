import fs from 'fs-extra'
import slugifyUrl from 'slugify'
import path from 'path'

export function replacePlaceholders(str, placeholders) {
  let result = str
  for (const [key, value] of Object.entries(placeholders)) {
    result = result.replaceAll(key, value)
  }
  return result
}

export function readJson(path) {
  const text = fs.readFileSync(path, 'utf8')
  const parsed = JSON.parse(text)
  return parsed
}

export function ensureDirExists(filePath) {
  var currentDirName = path.dirname(filePath)
  if (fs.existsSync(currentDirName)) return true
  ensureDirExists(currentDirName) // check nested dir
  fs.mkdirSync(currentDirName) // create folder for this one
}

export function saveJson(path,object) {
  ensureDirExists(path)
  fs.writeFileSync(path, JSON.stringify(object, null, 2))
}

export function readText(path) {
  const str = fs.readFileSync(path, 'utf8')
  return str
}

export function saveText(path, str) {
  ensureDirExists(path)
  fs.writeFileSync(path, str)
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
export function shuffle(array) {
  if (!array) return []
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

