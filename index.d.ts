import { GraphQLFormattedError, DocumentNode } from 'graphql'

export declare const GraphQLErrorHandler = (
  error: GraphQLFormattedError,
  query: string | DocumentNode,
  filename?: string) => never
