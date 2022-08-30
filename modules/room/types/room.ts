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
  content: string

  schedule: [Schedule]

  tags: [Tag]
}

export interface Schedule {
  date_from: string
  date_to: string
  description: string
  week: [Week]
}

export interface Week {
  week_days: [string]
  time_slots: [Timeslot]
}

export interface Timeslot {
  time_from: string
  time_to: string
  color: string
  price: number
}
