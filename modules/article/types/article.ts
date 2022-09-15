import { Media } from "@modules/media/types/article";

export interface Article {
  id: string
  slug: string
  title: string
  content: string

  preview: Media
}
