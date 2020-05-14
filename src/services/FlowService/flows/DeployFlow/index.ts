/* eslint-disable @typescript-eslint/camelcase */
import Fuse from 'fuse.js'
import {
  BlockSuggestionPayload,
  Command,
  CommandResponse,
  ViewSubmissionPayload,
} from '../../../../types/SlackAPI'
import { inject } from '../../../../utils/inject'
import { ProjectService } from '../../../ProjectService'
import { Flow } from '../Flow'
import { DeployFlowAction } from './DeployFlowAction'
import { deployParams } from './DeployParam'
import { openView } from './utils/openView'

export class DeployFlow extends Flow {
  @inject
  private projectService!: ProjectService

  protected actionIds = [DeployFlowAction.Modal, ...deployParams.map(p => p.actionId)]

  run(data: Command): CommandResponse | boolean {
    openView(
      {
        type: 'modal',
        callback_id: DeployFlowAction.Modal,
        title: {
          type: 'plain_text',
          text: 'Deployment parameters',
        },
        submit: {
          type: 'plain_text',
          text: 'Deploy',
        },
        close: {
          type: 'plain_text',
          text: 'Cancel',
        },
        blocks: deployParams.map(p => p.getBlock()),
      },
      data.trigger_id,
    )

    return true
  }

  suggest(data: BlockSuggestionPayload) {
    const branches =
      data.action_id === DeployFlowAction.SelectFE
        ? this.projectService.getBranches('MDD', 'one-metadata-frontend')
        : this.projectService.getBranches('MDD', 'one-metadata-server')

    const fuse = new Fuse(branches, {
      shouldSort: true,
      includeScore: true,
      minMatchCharLength: 1,
      threshold: 0.3,
      distance: 100,
    })
    const result = fuse.search(data.value)
    return result.slice(0, 100).map(match => {
      // https://api.slack.com/reference/block-kit/composition-objects#option
      const safeText = match.item.slice(0, 75)
      return {
        text: safeText,
        value: safeText,
      }
    })
  }

  submit(data: ViewSubmissionPayload) {
    const values = Object.values(data.view.state.values).reduce((seed: any, inputSection) => {
      const valueController = Object.entries(inputSection as any)[0]
      if (valueController) {
        const [key, data] = valueController as any
        const deployParam = deployParams.find(p => p.actionId === key)
        if (deployParam) {
          seed[deployParam.name] = deployParam.parse(data)
        }
      }

      return seed
    }, {})

    // eslint-disable-next-line no-console
    console.log(values)
  }
}
