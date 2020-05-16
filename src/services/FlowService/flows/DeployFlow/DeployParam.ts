import { inject } from '../../../../utils/inject'
import { ProjectService } from '../../../ProjectService'
import { getSelectBox } from './blocks/getSelectBox'
import { getTextInput } from './blocks/getTextInput'
import { DeployFlowAction, DeployFlowParamAction } from './DeployFlowAction'

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
    const restoredBranchName =
      rawValue.length === 75 ? this.getBranches().find(b => b.startsWith(rawValue))! : rawValue
    // TODO check image tag generation logic (length, case, etc)
    const imageTag = `0.0.0-${restoredBranchName}-SNAPSHOT`

    return imageTag
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
