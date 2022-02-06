import { FetchResult } from "@apollo/client";
import { GraphQLResponse } from 'apollo-server-types';
import { isNetworkError, isResolverError } from './errorTypes';
import { throwError } from "./throwError";
Error.stackTraceLimit = 20

type ApolloServerExecuteOperationResponse = GraphQLResponse
type ApolloClientResponse = FetchResult<any, Record<string, any>, Record<string, any>>

export const handleResult = async (promise: Promise<ApolloClientResponse> | Promise<ApolloServerExecuteOperationResponse>) => {
  const spareError = new Error('Spare Error')
  const callStack = spareError.stack
  try {
    const { data, errors } = await promise
    if (!data) {
      if (!errors || errors.length < 1) throw new Error("Seems unlikely")
      throw new Error("don't know how to handle these anymore")
    }
    return { data }
  } catch (e) {

    if (isNetworkError(e)) {
      const { extensions, originalError, message } = e.networkError.result.errors[0]
      const stack = originalError ? originalError.stack : callStack
      throwError(
        message,
        extensions.operation.source,
        extensions.locations[0],
        stack)
    } else if (isResolverError(e)) {
      const { extensions, message } = e.graphQLErrors[0]
      throwError(
        message,
        extensions.operation.source,
        extensions.locations[0],
        callStack)
    } else {
      throw e
    }
  }
}
