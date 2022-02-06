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
  }
  originalError?: Error
}

type NetworkError = Error & {
  networkError: {
    result?: {
      errors: GraphQLError[]
    }
  }
}

export function isNetworkError(e: unknown): e is NetworkError {
  return Object.hasOwnProperty.call(e, 'networkError')
}

type ResolverError = Error & {
  graphQLErrors: GraphQLError[]
}

export function isResolverError(e: unknown): e is ResolverError {
  return Object.hasOwnProperty.call(e, 'graphQLErrors')
}