## @starkow/logger

### why?

- i wanted to make it by my own
- it's gorgeous i think
- yeah

### usage

```ts
import { Logger, Color, TextStyle } from '@starkow/logger'

const log = Logger.create('foo', Color.Green)

log('bar', Logger.color('baz', Color.Red, TextStyle.Bold), ':)')
```

alternative imports:

```ts
import { Logger } from '@starkow/logger'
import { Color, TextStyle } from '@starkow/logger/colors'
```

## reference

### `Logger.create(name: string, ...colors: AnyColor[])`

> Initializes logger function

Returns: `LoggerInstance`

```js
Logger.create('bot', Color.Green, TextStyle.Underline)('started!')
```

### `Logger.log(...)`, `Logger.error(...)` & `Logger.warn(...)`

> Logs data to chosen stream

```js
Logger.log('foo', { bar: 'baz' })
Logger.error('error!')
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

#### `(...data: any[]): void`

```js
log('foo', ['bar', 13.37])
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
