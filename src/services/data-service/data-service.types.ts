export interface TopSongsEntry {
  Name: string,
  Artist: string,
  Decade: number,
  Rank: number,
  danceability: number,
  energy: number,
  key: number,
  loudness: number,
  speechiness: number,
  acousticness: number,
  instrumentalness: number,
  liveness: number,
  valence: number,
  tempo: number,
  duration_ms: number,
  time_signature: number,
  Country: string,
  City: string
}


export type TopSongsList = TopSongsEntry[]