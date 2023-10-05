import { LogLevel } from './types/enums'

export class LoggerConfig {
  private filePath: string | null = null
  private level: LogLevel = LogLevel.Error

  public setFilePath(path: string) {
    this.filePath = path
  }

  public getFilePath() {
    return this.filePath
  }

  public resetFilePath() {
    this.filePath = null
  }

  public setLogLevel(level: LogLevel) {
    this.level = level
  }

  public getLogLevel() {
    return this.level
  }

  public resetLogLevel() {
    this.level = LogLevel.Generic
  }

  public isFileLoggingEnabled() {
    return this.filePath !== null
  }

  public isLogLevelSuitable(level: LogLevel) {
    return level <= this.level
  }
}
