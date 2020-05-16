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
import { ProjectService } from '../../../ProjectService'
import { Flow } from '../Flow'
import { DeployFlowAction } from './DeployFlowAction'
import { BranchDeployParam, deployParams } from './DeployParam'
import { openView } from './utils/openView'
import { triggerBuild } from './utils/triggerBuild'

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
        AICORE_APP_IMAGE: 'latest',
        RDM_MDM_APP_IMAGE: '0.1.10',
        DEPLOY_GROUPS: 'MMM,FE,DP,AI',
        MMM_DROP_FIRST: true,
        MMM_LOAD_DATA: true,
        MMM_ORACLE: false,
        // artificial parameter to track on build completion
        TRACK_ID: trackId,
      },
    )

    return triggerBuild(values).then(isOk => isOk)
  }
}
