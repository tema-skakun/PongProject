import * as winston from 'winston';

export const LOGGER: winston.Logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message }) => {
			return `${timestamp} ${level}: ${message}`;
		  })
	),
	transports: [
		new winston.transports.File({filename: 'pong.log.json',
		format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.json()
		  )})
	]
})

export const HUMAN_LOGGER: winston.Logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message }) => {
			return `${timestamp} ${level}: ${message}`;
		  })
	),
	transports: [
		new winston.transports.File({filename: 'pong.log',
		format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.simple()
		  )})
	]
})
