
import { ServerParseError } from '@apollo/client/link/http';
import { throwError } from './throwError';
import { onError } from "@apollo/client/link/error";

function isServerParseError(error: Error | undefined | null): error is ServerParseError {
  return error != null && Object.prototype.hasOwnProperty.call(error, 'bodyText') && Object.prototype.hasOwnProperty.call(error, 'response') && Object.prototype.hasOwnProperty.call(error, 'statusCode')
}

export const errorLink = onError((err) => {
  const { networkError, operation } = err
  debugger
  if (isServerParseError(networkError)) {
    const { status } = networkError.response
    if (status >= 400) {
      const error = new Error()
      throwError(`Server returned HTTP ${status}`, operation?.query?.loc?.source.body, { line: 1, column: 1 }, error.stack)
    }
  }
});