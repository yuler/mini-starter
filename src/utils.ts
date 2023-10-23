export function promisify<T extends (...args: any[]) => any>(api: T) {
  return (options?: Parameters<T>[0]) =>
    new Promise<Parameters<NonNullable<Parameters<T>[0]['success']>>[0]>(
      (resolve, reject) => {
        return api({
          success: resolve,
          fail: reject,
          ...(options as object),
        })
      },
    )
}

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<ArgumentsType extends unknown[], ReturnType>(
  fn: (...args: ArgumentsType) => ReturnType,
  wait = 0,
  immediate = false,
): DebouncedFunction<ArgumentsType, ReturnType> {
  let timeout: number | undefined
  let result: ReturnType

  const debounced = function (this: any, ...args: ArgumentsType) {
    const later = () => {
      timeout = undefined
      if (!immediate) {
        result = fn.apply(this, args)
      }
    }

    const shouldCallNow = immediate && !timeout

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait) as any as number

    if (shouldCallNow) {
      result = fn.apply(this, args)
    }

    return result
  }

  debounced.cancel = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
  }

  return debounced
}

export interface DebouncedFunction<
  ArgumentsType extends unknown[],
  ReturnType,
> {
  (...args: ArgumentsType): ReturnType
  cancel(): void
}

export function getErrorMessage(error: any) {
  console.error(error)
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (error.data && error.data.error) return error.data.error
  if (error.errMsg) return error.errMsg
  if (error.msg) return error.msg
  return '未知错误'
}
