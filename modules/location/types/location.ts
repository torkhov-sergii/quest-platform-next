export interface Location {
  id: string
  slug: string

  title: string
  content: LocationContent
}

export interface LocationContent {
  city: string
  address: string
  phone: string
  email: string

  lat: number
  lon: number
}
