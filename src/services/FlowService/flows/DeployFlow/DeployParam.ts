import { inject } from '../../../../utils/inject'
import { ProjectService } from '../../../ProjectService'
import { getSelectBox } from './blocks/getSelectBox'
import { getTextInput } from './blocks/getTextInput'
import { DeployFlowAction, DeployFlowParamAction } from './DeployFlowAction'
import { ImageTagBuilder } from './utils/ImageTagBuilder'

interface DeployParam<T> {
  name: string
  actionId: DeployFlowParamAction
  getBlock(): any
  parse(data: any): T
}

export class BranchDeployParam implements DeployParam<string> {
  @inject
  private projectService!: ProjectService

  constructor(
    public name: string,
    public actionId: DeployFlowParamAction,
    private repository: { projectId: string; repositoryName: string },
  ) {}

  getBlock() {
    return getSelectBox(this.name, this.actionId, 'dev')
  }

  getBranches() {
    return this.projectService.getBranches(
      this.repository.projectId,
      this.repository.repositoryName,
    )
  }

  parse(data: any) {
    const rawValue = data.selected_option.value as string
    /**
     * Option values must be maximum 75 characters long to be processed by Slack API.
     * So we need to restore values which match this length.
     *
     * @see {@link createSafeOption} for details
     */
    const restoredBranchName =
      rawValue.length === 75 ? this.getBranches().find(b => b.startsWith(rawValue))! : rawValue

    return new ImageTagBuilder(restoredBranchName).exec()
  }
}

class InputDeployParam implements DeployParam<string> {
  constructor(public name: string, public actionId: DeployFlowParamAction) {}

  getBlock() {
    return getTextInput(this.name, this.actionId)
  }

  parse(data: any) {
    return data.value
  }
}

export const deployParams = [
  new InputDeployParam('NOMAD_ID', DeployFlowAction.SelectNomadId),
  new BranchDeployParam('FE_APP_IMAGE', DeployFlowAction.SelectFE, {
    projectId: 'MDD',
    repositoryName: 'one-metadata-frontend',
  }),
  new BranchDeployParam('BE_APP_IMAGE', DeployFlowAction.SelectBE, {
    projectId: 'MDD',
    repositoryName: 'one-metadata-server',
  }),
]
