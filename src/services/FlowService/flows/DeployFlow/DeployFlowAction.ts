export enum DeployFlowAction {
  Modal = 'deploy-flow-modal',
  SelectFE = 'deploy-flow-select-fe',
  SelectBE = 'deploy-flow-select-be',
  SelectNomadId = 'deploy-flow-select-nomad-id',
}

export type DeployFlowParamAction = Exclude<DeployFlowAction, DeployFlowAction.Modal>
