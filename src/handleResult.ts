import { FetchResult } from "@apollo/client";
import { throwError } from "./throwError"

Error.stackTraceLimit = 20

export const handleResult = async (result: Promise<FetchResult<any, Record<string, any>, Record<string, any>>>) => {
  const spareError = new Error('Spare Error')
  try {
    const { data, errors } = await result
    if (!data) {
      if (!errors || errors.length < 1) throw new Error("Seems unlikely")
      throw new Error("don't know how to handle these anymore")
    }
    return { data }
  } catch (e) {
    if (e.networkError) {
      const { extensions, originalError, message } = e.networkError.result.errors[0]
      const stack = spareError.stack.split("\n").slice(10).join("\n")
      throwError(
        message,
        extensions.operation.source,
        extensions.locations[0],
        stack)
    } else {
      throw e
    }
  }
}
