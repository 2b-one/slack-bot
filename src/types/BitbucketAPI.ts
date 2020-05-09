export interface PagedResponse<T = any> {
  values: T[]
  size: number
  start: number
  limit: number
  nextPageStart: number
  isLastPage: boolean
}

export interface BranchInfo {
  id: string //'refs/heads/ROG-437-components-in-rules'
  displayId: string //'ROG-437-components-in-rules'
  type: 'BRANCH'
  latestCommit: string //'0eec94528db88c7a5fab4334a1696451da1d5e9c'
  latestChangeset: string //'0eec94528db88c7a5fab4334a1696451da1d5e9c'
  isDefault: boolean
}
