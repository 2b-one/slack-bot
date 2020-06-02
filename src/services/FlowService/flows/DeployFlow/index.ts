/* eslint-disable @typescript-eslint/camelcase */
import Fuse from 'fuse.js'
import { v4 } from 'uuid'
import {
  BlockSuggestionPayload,
  Command,
  CommandResponse,
  ViewSubmissionPayload,
} from '../../../../types/SlackAPI'
import { inject } from '../../../../utils/inject'
import { triggerBuild } from '../../../../utils/triggerBuild'
import { DeployTrackService } from '../../../DeployTrackService'
import { CommandFlow } from '../Flow'
import { DeployFlowAction } from './DeployFlowAction'
import { BranchDeployParam, deployParams } from './DeployParam'
import { openView } from './utils/openView'

export class DeployFlow extends CommandFlow {
  @inject
  private deployTrackService!: DeployTrackService

  readonly actionIds = [DeployFlowAction.Modal, ...deployParams.map(p => p.actionId)]
  readonly command = '/2b-deployed'

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
    const param = deployParams.find(p => p.actionId === data.action_id)
    if (!param || !(param instanceof BranchDeployParam)) {
      return []
    }

    const fuse = new Fuse(param.getBranches(), {
      shouldSort: true,
      includeScore: true,
      minMatchCharLength: 1,
      threshold: 0.3,
      distance: 100,
    })

    return fuse.search(data.value).map(match => ({
      text: match.item,
      value: match.item,
    }))
  }

  submit(data: ViewSubmissionPayload) {
    const trackId = v4()
    const values = Object.values(data.view.state.values).reduce(
      (seed: any, inputSection) => {
        const valueController = Object.entries(inputSection as any)[0]
        if (valueController) {
          const [key, data] = valueController as any
          const deployParam = deployParams.find(p => p.actionId === key)
          if (deployParam) {
            seed[deployParam.name] = deployParam.parse(data)
          }
        }

        return seed
      },
      {
        NOMAD_DC: 'dev1',
        DPM_APP_IMAGE: 'dev',
        DPE_APP_IMAGE: 'dev',
        RDM_MDM_APP_IMAGE: '0.1.10',
        DEPLOY_GROUPS: 'MMM,FE,DP,AI',
        MMM_DROP_FIRST: true,
        MMM_LOAD_DATA: true,
        MMM_ORACLE: false,
        // artificial parameter to track on build completion
        TRACK_ID: trackId,
        // artificial parameter to show deployment author
        AUTHOR: `@${data.user.username}`,
      },
    )

    let hasErrors = false
    const errors = {} as { [key: string]: string }
    for (const deployParam of deployParams) {
      if (values[deployParam.name] == null) {
        errors[deployParam.actionId] = 'required'
        hasErrors = true
      }
    }

    if (hasErrors) {
      return Promise.resolve({ response_action: 'errors' as 'errors', errors })
    }

    return triggerBuild(values).then(isOk => {
      if (isOk) {
        this.deployTrackService.subscribe(data.user.id, trackId)
        return isOk
      }

      return {
        response_action: 'errors' as 'errors',
        errors: {
          // Slack doesn't provide means for showing form based errors, so we use the first field
          [deployParams[0].actionId]: `Jenkins doesn't respond`,
        },
      }
    })
  }
}
