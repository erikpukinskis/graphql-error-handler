import { annotateSource } from './annotateSource'
import { SourceLocation } from 'graphql'

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

export const throwError = (message: string, operationSource: string, location: SourceLocation, stack: string, filename?: string) => {
  let annotatedQuery
  if (operationSource && location) {
    annotatedQuery = annotateSource(operationSource, location, filename)
  } else {
    console.warn('Cannot show location of error in GraphQL source because no query was found in the error extensions. Did you install the IncludeQueryOnErrorPlugin in your ApolloServer instance?')
  }
  const error = `${message}\n${annotatedQuery ? `${annotatedQuery}\n` : ''}${stack}\n`
  throw new Error(error)
}

