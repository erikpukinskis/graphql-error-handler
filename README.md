`graphql-error-handler` takes a GraphQL error and throws it, with a few nice features:

1) It will print out the resolver error trace if an error was thrown in the resolver
2) It will log the query and mark exactly where the syntax error occurred, if there was one

It also has no dependencies!

# Have your tests throw nice errors when testing your Apollo Server:

Add a test helper like so:
```
import graphqlErrorHandler from 'graphql-error-handler';

export const getApolloQueryFunction = (apollo: ApolloServer) => {
  return async (query: Operation['query'], variables?: Operation['variables']) => {
    const out = await apollo.executeOperation({ query, variables })
    if (out.errors) {
      graphqlErrorHandler(out.errors[0], query)
    }
    return out
  }
}
```
... and then when there's a problem in your query your test will throw a helpful error:

```
let query
beforeAll(async () => {
  const apollo = initApollo()
  query = getApolloQueryFunction(apollo)
})

it("should return four stories", async () => {
  const { data } = await query(
    gql`
      query GetStories {
        storied {
          id
        }
      }
    `
  )
  expect(data.stories).toHaveLength(4)
})
```

Under normal circumstances, with the typo, data will simply be undefined. But with
`graphql-error-handler` you'll get a nice listing of where exactly the typo is.

# Catching parsing errors when loading .grapqhl files in Jest:

You can use graphql-tag to load .schema files in Jest, but if there's an error,
it won't tell you where it is. `graphql-error-handler` can help:

```
// jest-transform-graphql.js
const loader = require('graphql-tag/loader');
const graphQLErrorHandler = require("graphql-error-handler")

module.exports = {
  process(src, filename) {
    // call directly the webpack loader with a mocked context
    // as graphql-tag/loader leverages `this.cacheable()`
    try {
      return loader.call({ cacheable() { } }, src);
    } catch (e) {
      graphQLErrorHandler(e, src, filename)
    }
  },
};
```