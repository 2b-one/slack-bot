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
  buildInfoUrl: string
}

interface BaseDeployInfo {
  trackId: string
  buildUrl: string
}

interface SuccessDeployInfo extends BaseDeployInfo {
  success: true
  nomadUrl: string
  envUrl: string
}

interface FailedDeployInfo extends BaseDeployInfo {
  success: false
}

export type DeployInfo = SuccessDeployInfo | FailedDeployInfo
