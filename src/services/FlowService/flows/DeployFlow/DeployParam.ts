import { getSelectBox } from './blocks/getSelectBox'
import { getTextInput } from './blocks/getTextInput'
import { DeployFlowAction, DeployFlowParamAction } from './DeployFlowAction'

interface DeployParam<T> {
  name: string
  actionId: DeployFlowParamAction
  getBlock(): any
  parse(data: any): T
}

class BranchDeployParam implements DeployParam<string> {
  constructor(public name: string, public actionId: DeployFlowParamAction) {}

  getBlock() {
    return getSelectBox(this.name, this.actionId, 'dev')
  }

  parse(data: any) {
    return data.selected_option.value as string
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
  new BranchDeployParam('FE_APP_IMAGE', DeployFlowAction.SelectFE),
  new BranchDeployParam('BE_APP_IMAGE', DeployFlowAction.SelectBE),
]
