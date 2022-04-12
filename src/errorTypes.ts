type Location = {
  line: number
  column: number
}

type GraphQLError = {
  message: string
  extensions: {
    locations: Location[]
    operation: {
      source: string
    }
    exception: {
      stacktrace: string[]
    }
  }
  originalError?: Error
}

export function isGraphQLError(e: unknown): e is GraphQLError {
  return Array.isArray((e as GraphQLError)?.extensions?.locations)
}

type NetworkError = Error & {
  networkError: {
    result: {
      errors: GraphQLError[]
    }
  }
}

export function isNetworkError(error: unknown): error is NetworkError {
  const e = error as NetworkError
  return e.networkError != null && e.networkError.result != null
}

type ResolverError = Error & {
  graphQLErrors: [GraphQLError]
}

export function isResolverError(error: unknown): error is ResolverError {
  const e = error as ResolverError
  return e.graphQLErrors != null && e.graphQLErrors.length > 0
}
