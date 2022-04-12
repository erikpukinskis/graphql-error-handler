import type { GraphQLFormattedError } from "graphql"
import { isNetworkError, isResolverError, isGraphQLError } from "./errorTypes"
import { buildError } from "./buildError"
Error.stackTraceLimit = 20

export const handleResult = async <Data extends Record<string, unknown>>(
  promise: Promise<{
    data?: Data | null | undefined
    errors?: readonly GraphQLFormattedError[]
  }>
) => {
  const spareError = new Error("Spare Error")
  const callStack = spareError.stack
  try {
    const { data, errors } = await promise
    if (data == null) {
      if (!errors || errors.length < 1) throw new Error("Seems unlikely")
      if (!isGraphQLError(errors[0])) {
        console.log("ERROR", JSON.stringify(errors[0], null, 4))
        throw new Error(
          `Don't know how to parse GraphQL error ${errors[0].message}`
        )
      }
      const { extensions, message } = errors[0]
      const stack = extensions.exception?.stacktrace?.join("\n") ?? callStack
      throw buildError(
        message,
        extensions.operation.source,
        extensions.locations[0],
        stack
      )
    }
    return { data }
  } catch (e) {
    if (isNetworkError(e)) {
      const { extensions, originalError, message } =
        e.networkError.result.errors[0]
      const stack = originalError ? originalError.stack : callStack
      throw buildError(
        message,
        extensions.operation.source,
        extensions.locations[0],
        stack
      )
    } else if (isResolverError(e)) {
      const { extensions, message } = e.graphQLErrors[0]
      throw buildError(
        message,
        extensions.operation.source,
        extensions.locations[0],
        callStack
      )
    } else {
      throw e
    }
  }
}
