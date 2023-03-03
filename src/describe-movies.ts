import { chat } from './chatgpt'
import { shuffle, readText, readJson, saveJson, replacePlaceholders } from './utils'

export async function describeMovie(movieTitle) {
  let sd, od, cd = ''

  let movieDescribeSetting = readText('./data/messages/movie-describe-setting.txt')
  movieDescribeSetting = replacePlaceholders(movieDescribeSetting, {
    '{{movie}}': movieTitle,
  })
  sd = await chat(movieDescribeSetting)

  let movieDescribeObjective = readText('./data/messages/movie-describe-objective.txt')
  movieDescribeObjective = replacePlaceholders(movieDescribeObjective, {
    '{{movie}}': movieTitle,
  })
  od = await chat(movieDescribeObjective)
  od = od.replace('Objective:', '').trim()

  let movieDescribeClimax = readText('./data/messages/movie-describe-climax.txt')
  movieDescribeClimax = replacePlaceholders(movieDescribeClimax, {
    '{{movie}}': movieTitle,
  })
  cd = await chat(movieDescribeClimax)

  return { sd, od, cd }
}

export async function describeMovies() {
  const movies = readText('./data/lists/movies.txt').split('\n')
  let movieDescriptions = []
  for (let movieTitle of movies) {
    // .slice(0, 10)
    // console.log('Describing', movieTitle)
    const { sd, od, cd } = await describeMovie(movieTitle)
    const movieDescription = {
      title: movieTitle,
      setting: sd.trim(),
      objective: od.trim(),
      climax: cd.trim(),
    }
    movieDescriptions.push(movieDescription)
    saveJson(`./data/out/movie-descriptions.json`, movieDescriptions)
  }
}
