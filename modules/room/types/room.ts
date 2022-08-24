import { Location } from '@modules/location/types/location'

export interface Room {
  id: string
  title: string
  slug: string

  duration: number
  break: number
  players_from: number
  players_to: number
  genre: string
  difficulty: string
  fear: string
  color: string

  label: boolean
  label_data: JSON
  presale: boolean
  presale_data: JSON
  announcement: boolean
  announcement_data: JSON
  unavailable: boolean
  unavailable_data: JSON

  location: Location
  content: JSON
}
