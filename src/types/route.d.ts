import type { RouteRecordName } from 'vue-router'

export type hrefType = {
  name?: RouteRecordName
  query?: {
    [x: string | number]: string | number
  }
  params?: {
    [x: string | number]: string | number
  }
}
