import { annotateSource } from './annotateSource'
import { SourceLocation, DocumentNode } from 'graphql'

// Example GraphQL error:
// {
//   message: 'Expected Name, found "}".',
//   locations: [
//     {
//       line: 33,
//       column: 1,
//     }
//   ]
// }

export const throwError = (message: string, operationSource: string | DocumentNode | undefined, location: SourceLocation | undefined, stack: string | undefined, filename?: string) => {
  let annotatedQuery
  if (operationSource && location) {
    annotatedQuery = annotateSource(operationSource, location, filename)
  } else {
    console.warn('Cannot show location of error in GraphQL source because no query was found in the error extensions. Did you install the IncludeQueryOnErrorPlugin in your ApolloServer instance?')
  }
  stack = stack?.split("\n").slice(1).join("\n")
  const error = `${message}\n${annotatedQuery ? `${annotatedQuery}\n` : ''}${stack}\n`
  throw new Error(error)
}

