import { BackgroundColor, Color, TextStyle } from './types/enums'
import { AnyColor } from './types/types'

import { isPlainObject } from './utils'

interface LogUpdateParams {
  clearLastLine?: boolean
}

interface LogFunction {
  (...data: any[]): void

  update(params: LogUpdateParams, ...data: any[]): void
  update(...data: any[]): void

  error(...data: any[]): void

  warn(...data: any[]): void
}

export class Logger {
  /** Colorize given `data` with given `colors` */
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
   * @param {AnyColor} colors Colors
   */
  public static prefix(name: string, ...colors: AnyColor[]) {
    return Logger.color(name, ...colors, TextStyle.Bold)
  }

  /**
   * Initializes logger function
   * @param {string} name Logger's name
   * @param {AnyColor} colors Colors
   */
  public static create(name: string, ...colors: AnyColor[]) {
    const prefix = Logger.prefix(name, ...colors)

    const fn = (...data: any[]) => console.log(prefix, ...data)

    fn.update = (...data: any[]) => {
      if (isPlainObject(data[0])) {
        const params: LogUpdateParams = data[0]
        const text = `${prefix} ${data.slice(1).map(value => value.toString()).join(' ')}`

        Logger.updateLog(text, params)
      } else {
        const text = `${prefix} ${data.map(value => value.toString()).join(' ')}`
        Logger.updateLog(text)
      }
    }

    fn.error = (...data: any[]) => console.error(prefix, ...data)
    fn.warn = (...data: any[]) => console.warn(prefix, ...data)

    return fn as LogFunction
  }
}
