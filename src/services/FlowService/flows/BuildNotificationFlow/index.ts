/* eslint-disable @typescript-eslint/camelcase */
import {
  BlockActionsPayload,
  Command,
  CommandResponse,
  MultiStaticSelectAction,
} from '../../../../types/SlackAPI'
import { inject } from '../../../../utils/inject'
import { BuildTrackService } from '../../../BuildTrackService'
import { ProjectService } from '../../../ProjectService'
import { Flow } from '../Flow'
import { respondToCommand } from './respondToCommand'

enum SubscribeFlowAction {
  Track = 'subscribe-flow-track',
}

export class BuildNotificationFlow extends Flow {
  @inject
  private buildTrackService!: BuildTrackService

  @inject
  private projectService!: ProjectService

  protected actionIds = [SubscribeFlowAction.Track]

  run(data: Command): CommandResponse | boolean {
    const { user_id, text: branchName } = data
    const branches = this.projectService.findBranch(branchName)
    if (branches.length === 0) {
      return { text: `command failed: incorrect branch` }
    }

    if (branches.length === 1) {
      this.buildTrackService.subscribe(user_id, branches[0])
      return true
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
            action_id: SubscribeFlowAction.Track,
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
      return
    }

    const tracked = []
    for (const option of selectAction.selected_options) {
      const [projectId, repositoryName, branchName] = option.value.split(' ')
      this.buildTrackService.subscribe(user.id, { projectId, repositoryName, branchName })
      tracked.push(`${repositoryName}/${branchName}`)
    }

    respondToCommand(response_url, {
      text: `command received: watching for ${tracked.map(t => `\`${t}\``).join(', ')}`,
    })
  }
}
