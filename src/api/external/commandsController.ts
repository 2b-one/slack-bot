import { Router } from 'express'
import { FlowService } from '../../services/FlowService'
import { serviceContainer } from '../../services/ServiceContainer'
import { Command, CommandResponse } from '../../types/SlackAPI'

const commandsController = Router()

commandsController.post<{}, CommandResponse, Command>('/commands', async (req, res) => {
  const flowService = serviceContainer.get(FlowService)
  const response = flowService.run(req.body)
  return res.status(200).json(response)
})

export { commandsController }
