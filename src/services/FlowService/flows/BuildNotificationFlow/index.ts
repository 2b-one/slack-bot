/* eslint-disable @typescript-eslint/camelcase */
import url from 'url'
import { BranchInfo, BuildInfo } from '../../../../types'
import {
  BlockActionsPayload,
  ButtonAction,
  Command,
  CommandResponse,
  isButtonAction,
  MultiStaticSelectAction,
} from '../../../../types/SlackAPI'
import { getBuildParameters } from '../../../../utils/getBuildParameters'
import { inject } from '../../../../utils/inject'
import { sendMessage } from '../../../../utils/sendMessage'
import { triggerBuild } from '../../../../utils/triggerBuild'
import { BuildTrackService } from '../../../BuildTrackService'
import { ProjectService } from '../../../ProjectService'
import { CommandFlow } from '../Flow'
import { BuildNotificationFlowAction } from './BuildNotificationFlowAction'
import { respondToCommand } from './respondToCommand'

export class BuildNotificationFlow extends CommandFlow {
  @inject
  private buildTrackService!: BuildTrackService

  @inject
  private projectService!: ProjectService

  readonly actionIds = [BuildNotificationFlowAction.Track, BuildNotificationFlowAction.Rebuild]
  readonly command = '/2b-notified'

  run(data: Command): CommandResponse | boolean {
    const { user_id, text: branchName } = data
    const branches = this.projectService.findBranch(branchName)
    if (branches.length === 0) {
      return { text: `Command failed: incorrect branch` }
    }

    if (branches.length === 1) {
      this.buildTrackService.subscribe(user_id, branches[0], this.notifyUser)
      return getConfirmationMessage(branches)
    }

    return {
      text: 'Input required',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Branch \`${branchName}\` found in multiple projects - user input required`,
          },
          accessory: {
            // https://api.slack.com/reference/block-kit/block-elements#static_multi_select
            type: 'multi_static_select',
            action_id: BuildNotificationFlowAction.Track,
            placeholder: {
              type: 'plain_text',
              text: 'Select projects to track',
            },
            options: branches.map(branch => {
              return {
                value: [branch.projectId, branch.repositoryName, branch.branchName].join(' '),
                text: {
                  type: 'plain_text',
                  text: branch.repositoryName,
                },
              }
            }),
          },
        },
      ],
    }
  }

  async continue(data: BlockActionsPayload<[MultiStaticSelectAction | ButtonAction]>) {
    const { actions, response_url, user, message } = data
    const action = actions[0]
    if (isButtonAction(action)) {
      if (!message) {
        return
      }

      const url = action.value
      if (!url) {
        return
      }

      const values = await getBuildParameters(url)
      if (!values) {
        return
      }

      triggerBuild(values)

      const [summaryBlock, contextBlock] = message.blocks
      respondToCommand(response_url, {
        blocks: [
          summaryBlock,
          {
            ...contextBlock,
            elements: contextBlock.elements.concat({
              type: 'plain_text',
              text: '(rebuild is triggered)',
              emoji: true,
            }),
          },
        ],
      })

      return
    }

    if (action.selected_options.length === 0) {
      return
    }

    const tracked = []
    for (const option of action.selected_options) {
      const [projectId, repositoryName, branchName] = option.value.split(' ')
      const branch = { projectId, repositoryName, branchName }
      this.buildTrackService.subscribe(user.id, branch, this.notifyUser)
      tracked.push(branch)
    }

    respondToCommand(response_url, getConfirmationMessage(tracked))
  }

  private notifyUser = (userId: string, data: BuildInfo, unsubscribe: () => void) => {
    if (data.success) {
      unsubscribe()
    }

    const outcome = `Build ${data.success ? 'succeed' : 'failed'}:`
    const branchName = `${data.bitbucketRepo}/${data.branchName}`
    const blocks: any[] = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${outcome} \`${branchName}\``,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `See build details <${data.buildUrl}|here>.`,
          },
        ],
      },
    ]

    if (!data.success) {
      const buildInfoUrl = url.resolve(data.buildUrl, '/api/json?pretty=true')
      blocks.push({
        type: 'actions',
        elements: [
          {
            type: 'button',
            action_id: BuildNotificationFlowAction.Rebuild,
            value: buildInfoUrl,
            style: 'danger',
            text: {
              type: 'plain_text',
              text: 'Rebuild',
              emoji: true,
            },
          },
        ],
      })
    }

    sendMessage(userId, `${outcome} ${branchName}`, blocks)
  }
}

function getConfirmationMessage(branches: BranchInfo[]) {
  return {
    text: `Command received: watching for ${branches
      .map(b => `\`${b.repositoryName}/${b.branchName}\``)
      .join(', ')}`,
  }
}
