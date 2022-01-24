import { annotateQuery } from './annotateQuery'
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

const graphqlErrorHandler = (error, query, filename) => {
  if (!query) {
    query = error.extensions.operation.source
  }

  const location = error.locations ? error.locations[0] : error.extensions.locations[0]

  let annotatedQuery
  if (query && location) {
    annotatedQuery = annotateQuery(query, location, filename)
  } else {
    console.warn('Cannot show location of error in GraphQL source because no query was found in the error extensions. Did you install the IncludeQueryOnErrorPlugin in your ApolloServer instance?')
  }

  // The stack trace on `error` is often garbage coming from the Apollo
  // internals. What we often really want is the original error trace coming
  // from inside the resolve, which will be on `error.originalError`
  error.message = `${error.originalError ? error.originalError.stack : error.message}\n${annotatedQuery ? `${annotatedQuery}\n` : ''}`

  throw error
}

// query: string | undefined, location: SourceLocation

module.exports = graphqlErrorHandler


module.exports.handleResult = async (result) => {
  const spareError = new Error('Spare Error')
  console.log('handling promise...')
  try {
    const { data, errors } = await result
    if (!data) {
      debugger
      if (!errors || errors.length < 1) throw new Error("Seems unlikely")
      graphqlErrorHandler(errors[0], '')
    }
    return { data }
  } catch (e) {
    if (e.networkError) {
      const { extensions, originalError, message } = e.networkError.result.errors[0]
      const goodError = originalError || spareError
      goodError.message = message
      goodError.extensions = extensions
      graphqlErrorHandler(spareError)
    } else {
      throw e
    }
  }
}
