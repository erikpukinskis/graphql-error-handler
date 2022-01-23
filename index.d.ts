import { GraphQLFormattedError, DocumentNode } from 'graphql'

export declare default = (
  error: GraphQLFormattedError,
  query: string | DocumentNode,
  filename?: string) => never
