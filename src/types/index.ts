export interface BranchInfo {
  projectId: string
  repositoryName: string
  branchName: string
}

export interface BuildInfo {
  jobId: string
  bitbucketProject: string
  bitbucketRepo: string
  branchName: string
  success: boolean
  buildUrl: string
}
