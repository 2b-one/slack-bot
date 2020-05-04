import got from 'got'
import { PagedResponse } from '../../../types/BitbucketAPI'

export async function isBranchExist(projectId: string, branchName: string) {
  return got<PagedResponse>(
    `https://bitbucket.atc.services/rest/api/1.0/projects/MDD/repos/${projectId}/commits`,
    {
      responseType: 'json',
      searchParams: {
        until: `refs/heads/${branchName}`,
        limit: 1,
      },
      headers: {
        authorization: `Bearer ${process.env.bitbucket_token}`,
      },
    },
  )
    .then(res => res.body.size === 1)
    .catch(() => {
      /** Error comes with an empty status code for some reason */
      return false
    })
}
