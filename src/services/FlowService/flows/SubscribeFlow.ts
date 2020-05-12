/* eslint-disable @typescript-eslint/camelcase */
import { BlockActionsPayload, MultiStaticSelectAction } from '../../../types/SlackAPI'
import { inject } from '../../../utils/inject'
import { responseToCommand } from '../../../utils/responseToCommand'
import { ProjectService } from '../../ProjectService'
import { SubscriptionService } from '../../SubscriptionService'
import { Flow } from './Flow'

export class SubscribeFlow extends Flow {
  @inject
  private subscriptionService!: SubscriptionService

  @inject
  private projectService!: ProjectService

  start() {
    const { user_id, text: branchName } = this.cmd
    const branches = this.projectService.findBranch(branchName)
    if (branches.length === 0) {
      return { text: `command failed: incorrect branch` }
    }

    if (branches.length === 1) {
      this.subscriptionService.subscribe(user_id, branches[0])
      return { text: 'command received' }
    }

    return {
      text: 'input required',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `branch \`${branchName}\` found in multiple projects - user input required`,
          },
          accessory: {
            // https://api.slack.com/reference/block-kit/block-elements#static_multi_select
            type: 'multi_static_select',
            action_id: this.getActionId('track'),
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

  continue(data: BlockActionsPayload<[MultiStaticSelectAction]>) {
    const { actions, response_url, user } = data
    const selectAction = actions[0]
    if (selectAction.selected_options.length === 0) {
      return false
    }

    const tracked = []
    for (const option of selectAction.selected_options) {
      const [projectId, repositoryName, branchName] = option.value.split(' ')
      this.subscriptionService.subscribe(user.id, { projectId, repositoryName, branchName })
      tracked.push(`${repositoryName}/${branchName}`)
    }

    responseToCommand(response_url, {
      text: `command received: watching for ${tracked.map(t => `\`${t}\``).join(', ')}`,
    })

    return true
  }
}
