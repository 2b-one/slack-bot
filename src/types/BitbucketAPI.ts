export interface PagedResponse<T = any> {
  values: T[]
  size: number
  start: number
  limit: number
  nextPageStart: number
  isLastPage: boolean
}
