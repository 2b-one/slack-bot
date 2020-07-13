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
    return getSelectBox(this.name, this.actionId, 'master')
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
  constructor(
    public name: string,
    public actionId: DeployFlowParamAction,
    public options: {
      placeholder?: string
      hint?: string
      initialValue?: string
    },
  ) {}

  getBlock() {
    return getTextInput(this.name, this.actionId, this.options)
  }

  parse(data: any) {
    return data.value
  }
}

export const deployParams = [
  new InputDeployParam('NOMAD_ID', DeployFlowAction.SelectNomadId, {
    placeholder: 'environment name',
    hint: 'https://NOMAD_ID.dev1.atc/',
  }),
  new BranchDeployParam('FE_APP_IMAGE', DeployFlowAction.SelectFE, {
    projectId: 'MDD',
    repositoryName: 'one-metadata-frontend',
  }),
  new BranchDeployParam('BE_APP_IMAGE', DeployFlowAction.SelectBE, {
    projectId: 'MDD',
    repositoryName: 'one-metadata-server',
  }),
  new InputDeployParam('AICORE_APP_IMAGE', DeployFlowAction.SelectAI, {
    placeholder: 'AI image tag',
    hint: 'Use "latest" if you deleted the value by accident',
    initialValue: 'latest',
  }),
]
