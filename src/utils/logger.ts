import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'

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
  defaultMeta: { service: '2b-slack-bot' },
  transports: [
    new transports.DailyRotateFile({
      filename: 'error.%DATE%.log',
      dirname: 'logs',
      level: 'error',
      zippedArchive: true,
    }),
    new transports.DailyRotateFile({
      filename: 'info.%DATE%.log',
      dirname: 'logs',
      level: 'info',
      zippedArchive: true,
    }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  )
}

export { logger }
