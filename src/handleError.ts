import { annotateSource } from './annotateSource'

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

export const handleError = (error: Error, filename: string) => {

  // if (!query) {
  //   query = error.extensions.operation.source
  // }

  // const location = error.locations ? error.locations[0] : error.extensions.locations[0]

  // let annotatedQuery
  // if (query && location) {
  //   annotatedQuery = annotateSource(query, location, filename)
  // } else {
  //   console.warn('Cannot show location of error in GraphQL source because no query was found in the error extensions. Did you install the IncludeQueryOnErrorPlugin in your ApolloServer instance?')
  // }

  // // The stack trace on `error` is often garbage coming from the Apollo
  // // internals. What we often really want is the original error trace coming
  // // from inside the resolve, which will be on `error.originalError`
  // error.message = `${error.originalError ? error.originalError.stack : error.message}\n${annotatedQuery ? `${annotatedQuery}\n` : ''}`

  // throw error
}




