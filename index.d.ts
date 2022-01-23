import { DocumentNode, GraphQLFormattedError } from 'graphql'

declare const graphqlErrorHandler: (
  error: GraphQLFormattedError,
  query: string | DocumentNode,
  filename?: string) => never

export default graphqlErrorHandler
