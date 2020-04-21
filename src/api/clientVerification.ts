import { RequestHandler } from 'express'

export const clientVerification: RequestHandler = (req, res, next) => {
  const token = process.env.verification_token
  const isStatusReq = req.path === '/status'
  if (req.body.token === token || isStatusReq) {
    next()
  } else {
    res.sendStatus(403)
  }
}
