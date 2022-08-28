import { Location } from '@modules/location/types/location'
import { Tag } from '@modules/tag/types/tag';

export interface Room {
  id: number
  title: string
  slug: string

  duration: number
  break: number
  players_from: number
  players_to: number
  genre: string
  difficulty: number
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

  tags: [Tag]
}
