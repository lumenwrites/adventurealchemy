import { chat } from './chatgpt'
import { shuffle, readText, readJson, saveJson, saveText, replacePlaceholders } from './utils'
import { developIdeas, developDetails } from './develop-ideas'
import { pitchIdeas } from './pitch-ideas'
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
  // await pitchIdeas(50)
  // await developIdeas(50)
  developDetails()
}

main()



