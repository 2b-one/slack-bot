import { AppHomeOpenedEvent, BlockActionsPayload, ButtonAction } from '../../../../types/SlackAPI'
import { inject } from '../../../../utils/inject'
import { BuildTrackService, parseBranch, serializeBranch } from '../../../BuildTrackService'
import { EventFlow } from '../Flow'
import { getHomeView } from './getHomeView'
import { HomeScreenFlowAction } from './HomeScreenFlowAction'
import { publishView } from './publishView'

export class HomeScreenFlow extends EventFlow {
  readonly actionIds = [HomeScreenFlowAction.Unsubscribe]
  readonly eventTypes = ['app_home_opened']

  @inject
  private buildTrackService!: BuildTrackService

  event(data: AppHomeOpenedEvent<any>) {
    if (data.tab === 'home') {
      this.updateHomeView(data.user, data.view?.hash)
    }
  }

  continue(data: BlockActionsPayload<[ButtonAction]>) {
    const [action] = data.actions
    const branch = parseBranch(action.value)
    if (branch) {
      this.buildTrackService.unsubscribe(data.user.id, branch)
      this.updateHomeView(data.user.id, data.view?.hash)
    }
  }

  private updateHomeView(userId: string, hash?: string) {
    publishView(
      getHomeView(
        this.buildTrackService.getSubscriptions(userId).map(branch => {
          const value = serializeBranch(branch)
          return { text: value, value }
        }),
      ),
      userId,
      hash,
    )
  }
}
