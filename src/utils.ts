import { createHash } from 'crypto'

import { RGBColor } from './types/interfaces'

export const isPlainObject = (value: any): value is Record<any, any> => value?.constructor === Object

/** Create a fixed int based on {@link input} */
export const hashInput = (input: string) => {
  const hash = createHash('sha256').update(input).digest('hex')

  return Number.parseInt(hash.slice(0, 6), 16)
}

/** Creates a fixed {@link RGBColor} based on {@link input} */
export const getFixedColor = (input: string): RGBColor => {
  const hash = hashInput(input)

  const r = (hash & 0xFF0000) >> 16
  const g = (hash & 0x00FF00) >> 8
  const b = (hash & 0x0000FF)

  return { r, g, b }
}
