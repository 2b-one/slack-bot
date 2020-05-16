import { createLogger, format, transports } from 'winston'
import packageInfo from '../../package.json'

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: '2b-slack-bot', version: packageInfo.version },
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
})

export { logger }
