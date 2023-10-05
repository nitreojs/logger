import { appendFile } from 'node:fs/promises'

import { BackgroundColor, Color, LogLevel, TextStyle } from './types/enums'
import { AnyColor } from './types/types'
import { RGBColor } from './types/interfaces'

import { getFixedColor, isPlainObject } from './utils'

import { LoggerConfig } from './config'

interface LoggerInstance {
  (...data: any[]): void

  update(params: LogUpdateParams, ...data: any[]): void
  update(...data: any[]): void

  error(...data: any[]): void
  warn(...data: any[]): void
  info(...data: any[]): void
  debug(...data: any[]): void
}

interface LogUpdateParams {
  clearLastLine?: boolean
}

export class Logger {
  public static config = new LoggerConfig()

  /**
   * Logs data using `console.log`
   * @param data Data to log
   */
  public static log(...data: any[]) {
    console.log(...data)
  }

  /**
   * Logs data to `stderr` via `console.error`
   * @param data Data to log
   */
  public static error(...data: any[]) {
    console.error(...data)
  }

  /**
   * Logs data via `console.warn`
   * @param data Data to log
   */
  public static warn(...data: any[]) {
    console.warn(...data)
  }

  /**
   * Logs data via `console.info`
   * @param data Data to log
   */
  public static info(...data: any[]) {
    console.info(...data)
  }

  /**
   * Logs data via `console.debug`
   * @param data Data to log
   */
  public static debug(...data: any[]) {
    console.debug(...data)
  }


  /**
   * Colorizes given `text` with given `colors`
   * @param text Text to colorize
   * @param colors Text colors
   */
  public static color(text: string, ...colors: AnyColor[]) {
    const startCodes = colors
    const endCodes = []

    /** Background color */
    if (startCodes.some(value => value >= BackgroundColor.Black && value <= BackgroundColor.White)) {
      endCodes.push(BackgroundColor.End)
    }

    /** Text style */
    if (startCodes.some(value => value >= TextStyle.Bold && value <= TextStyle.Strikethrough)) {
      const codes = startCodes.filter(value => value >= TextStyle.Bold && value <= TextStyle.Strikethrough)

      for (const code of codes) {
        endCodes.push(code + 20 + (code === TextStyle.Bold ? 1 : 0))
      }
    }

    /** Basic color */
    if (startCodes.some(value => (value >= Color.Black && value <= Color.White) || value === Color.Gray)) {
      endCodes.push(Color.End)
    }

    let start = startCodes.map(code => `\x1b[${code}m`).join('')
    let end = endCodes.map(code => `\x1b[${code}m`).join('')

    return start + text + end
  }

  /**
   * Colorizes given `text` with given RGB `color`
   * @param text Text to colorize
   * @param color RGB color
   */
  public static colorByRGB(text: string, color: RGBColor) {
    const code = `\x1b[38;2;${color.r};${color.g};${color.b}m`
    const reset = '\x1b[0m'

    return code + text + reset
  }

  /**
   * Updates last log line
   * @param {string} text New line's contexts
   * @param {LogUpdateParams} params Params
   */
  public static updateLog(text: string, params?: LogUpdateParams) {
    process.stdout.cursorTo(0)

    if (params?.clearLastLine ?? true) {
      process.stdout.moveCursor(0, -1)
    }

    process.stdout.write(text + '\n')
  }

  /**
   * Generates current logger prefix
   * @param {string} name Prefix name
   * @param {AnyColor} colors Prefix colors
   */
  public static prefix(name: string, ...colors: AnyColor[]) {
    return Logger.color(name, ...colors, TextStyle.Bold)
  }

  /**
   * Initializes logger function
   * @param {string} name Logger's name
   * @param {AnyColor} colors Name colors
   */
  public static create(name: string, ...colors: AnyColor[]) {
    let prefix: string

    // Generate fixed color based on {@link name} if no colors provided
    if (colors.length === 0) {
      prefix = Logger.colorByRGB(name, getFixedColor(name))
    } else {
      prefix = Logger.prefix(name, ...colors)
    }

    const fn = (...data: any[]) => {
      Logger.log(prefix, ...data)
      Logger.logToFile(name, LogLevel.Generic, ...data)
    }

    fn.update = (...data: any[]) => {
      if (isPlainObject(data[0])) {
        const params: LogUpdateParams = data[0]
        const prefixless = data.slice(1).map(value => value.toString()).join(' ')
        const text = `${prefix} ${prefixless}`

        Logger.updateLog(text, params)
        Logger.logToFile(name, LogLevel.Generic, prefixless)
      } else {
        const prefixless = data.map(value => value.toString()).join(' ')
        const text = `${prefix} ${prefixless}`

        Logger.updateLog(text)
        Logger.logToFile(name, LogLevel.Generic, prefixless)
      }
    }

    fn.info = (...data: any[]) => {
      if (!Logger.config.isLogLevelSuitable(LogLevel.Info)) {
        return
      }

      Logger.info(prefix, ...data)
      Logger.logToFile(name, LogLevel.Info, ...data)
    }

    fn.debug = (...data: any[]) => {
      if (!Logger.config.isLogLevelSuitable(LogLevel.Debug)) {
        return
      }

      Logger.debug(prefix, ...data)
      Logger.logToFile(name, LogLevel.Debug, ...data)
    }

    fn.warn = (...data: any[]) => {
      if (!Logger.config.isLogLevelSuitable(LogLevel.Warn)) {
        return
      }

      Logger.warn(prefix, ...data)
      Logger.logToFile(name, LogLevel.Warn, ...data)
    }

    fn.error = (...data: any[]) => {
      if (!Logger.config.isLogLevelSuitable(LogLevel.Error)) {
        return
      }

      Logger.error(prefix, ...data)
      Logger.logToFile(name, LogLevel.Error, ...data)
    }

    return fn as LoggerInstance
  }

  // TODO: refactor this wtf
  private static logToFile(name: string, type: LogLevel, ...data: string[]) {
    if (!Logger.config.isFileLoggingEnabled()) {
      return
    }

    const prefixesByType: Partial<Record<LogLevel, string>> = {
      [LogLevel.Info]:  'INFO ',
      [LogLevel.Warn]:  'WARN ',
      [LogLevel.Debug]: 'DEBUG',
      [LogLevel.Error]: 'ERROR'
    }

    const prefix = prefixesByType[type]

    const timestamp = new Date().toISOString()

    const log = data.map(v => `${timestamp} [${name}] ${prefix ? `${prefix} ` : ''}${v}`).join('\n')

    appendFile(Logger.config.getFilePath()!, log + '\n')
  }
}
