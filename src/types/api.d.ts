import type { IPeople } from '@/types/people'

export type queryParamsType = {
  page?: number
  filter?: string
  sorted?: keyof IPeople
}
