## @starkow/logger

### why?

- i wanted to make it by my own
- it's gorgeous i think
- fixed colors for static names (logger name `'foo'` will produce deterministic yet still random color every time)!
- it have log level
- file logs           exist  Yes👍
- yeah

### usage

```ts
import { Logger, Color, TextStyle } from '@starkow/logger'

const log = Logger.create('foo') // log will be given random yet deterministic color

log('bar', Logger.color('baz', Color.Red, TextStyle.Bold), ':)')
```

alternative imports:

```ts
import { Logger } from '@starkow/logger'
import { Color, TextStyle } from '@starkow/logger/colors'
```

#### log levels

priority:

1. `LogLevel.Generic` - `log(...)`, `log.log(...)`
2. `LogLevel.Info` - `log.info(...)` + all the above
3. `LogLevel.Debug` - `log.debug(...)` + all the above
4. `LogLevel.Warn` - `log.warn(...)` + all the above
5. `LogLevel.Error` - `log.error(...)` + all the above

default log level is `LogLevel.Error`

```ts
import { Logger, LogLevel } from '@starkow/logger'

Logger.config.setLogLevel(LogLevel.Info) // only Info and lower will be logged

const log = Logger.create('@starkow/logger')

log('is cool!')
log.info('is the best!')
log.debug('sucks') // we dont want this to be logged so we chose LogLevel.Info instead of LogLevel.Debug
```

#### filelogs

```ts
import { resolve } from 'node:path'

import { Logger } from '@starkow/logger'

Logger.config.setFilePath(resolve(__dirname, 'epic.log'))

Logger.create('this will be logged')('into a file!', { 42: true })
```

file `{__dirname}/epic.log` will look like this:

```log
2023-10-05T22:47:16.630Z [this will be logged] into a file! {"42":true}
```

## reference

### `Logger.create(name: string, ...colors: AnyColor[])`

> Initializes logger function

Returns: `LoggerInstance`

```js
Logger.create('bot', Color.Green, TextStyle.Underline)('started!')
```

### `Logger.log(...)`, `Logger.error(...)`, `Logger.warn(...)`, `Logger.debug(...)`, `Logger.info(...)`

> Logs data to chosen stream

```js
Logger.log('foo', { bar: 'baz' })
Logger.error('error!')
Logger.debug({ type: 'paid', amount: 13.49 })
```

### `Logger.prefix(name: string, ...colors: AnyColor[])`

> Generates current logger prefix

Returns: `string`

```js
const prefix = Logger.prefix('server', Color.Cyan)

Logger.log(prefix, 'started!')
```

### `Logger.color(text: string, ...colors: AnyColor[])`

> Colorizes given `text` with given `colors`

Returns: `string`

```js
const coloredFoo = Logger.color('foo', Color.Magenta, BackgroundColor.White)

Logger.log(coloredFoo)
```

### `Logger.updateLog(text: string, params?: LogUpdateParams)`

> Updates last log line

Returns: `void`

```js
Logger.log(      'Loading:   9%'        )
Logger.updateLog('Loading:  45%'        )
Logger.updateLog('Loading:  77%'        )
Logger.updateLog('Loading: 100% [Done!]')
```

### `LoggerInstance`

```js
const log = Logger.create('logger')
```

#### `(...data: any[]): void`, `log(...data: any[]): void`

```js
log(    'foo', ['bar', 13.37])
log.log('foo', ['bar', 13.37])
```

#### `update(...): void`

```js
log('1')
log.update('2')
log.update('3')
```

#### `error(...): void`

```js
log.error('failed!')
```

#### `warn(...): void`

```js
log.warn('something is about to crash!')
```

#### `debug(...): void`

```js
log.debug({ 42: 'the truth' })
```

#### `info(...): void`

```js
log.info('this log is very mandatory keep listening to me i swear')
```
