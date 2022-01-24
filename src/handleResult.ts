import { FetchResult } from "@apollo/client";
import { handleError } from "./handleError"

export const handleResult = async (result: Promise<FetchResult<any, Record<string, any>, Record<string, any>>>) => {
  const spareError = new Error('Spare Error')
  console.log('handling promise...')
  try {
    const { data, errors } = await result
    if (!data) {
      debugger
      if (!errors || errors.length < 1) throw new Error("Seems unlikely")
      handleError(errors[0], '')
    }
    return { data }
  } catch (e) {
    if (e.networkError) {
      const { extensions, originalError, message } = e.networkError.result.errors[0]
      const goodError = originalError || spareError
      goodError.message = message
      goodError.extensions = extensions
      handleError(spareError)
    } else {
      throw e
    }
  }
}