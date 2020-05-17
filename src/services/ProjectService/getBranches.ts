import got from 'got'
import * as url from 'url'
import { BranchInfo, PagedResponse } from '../../types/BitbucketAPI'
import { logger } from '../../utils/logger'

export async function getBranches(
  projectId: string,
  repositoryName: string,
  bitbucketHost: string,
  accessToken: string,
) {
  const limit = 500
  return got<PagedResponse<BranchInfo>>(
    url.resolve(
      bitbucketHost,
      `/rest/api/1.0/projects/${projectId}/repos/${repositoryName}/branches`,
    ),
    {
      responseType: 'json',
      searchParams: { limit },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  )
    .then(res => {
      const { isLastPage, values } = res.body
      if (!isLastPage) {
        logger.warn('bitbucket.untidyRepo', { bitbucketHost, projectId, repositoryName, limit })
      }

      return values
    })
    .catch(e => {
      logger.error('bitbucket.getBranches', {
        error: e.message,
        bitbucketHost,
        projectId,
        repositoryName,
        limit,
      })
      return [] as BranchInfo[]
    })
}
