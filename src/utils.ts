export const isPlainObject = (value: any): value is Record<any, any> => value?.constructor === Object
