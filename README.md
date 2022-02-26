`graphql-error-handler` takes a GraphQL error and throws it, with a few nice features:

1. It will print out the resolver error trace if an error was thrown in the resolver
2. It will log the query and mark exactly where the syntax error occurred, if there was one

It also has no dependencies!

### Todo

- [ ] Make sure `handleResult` handles 404s as gracefully as `errorLink`. Add a test for
      `ServeParseError404.json`.

### Setting up the error link

A good number of errors can be caught by an Apollo Client error link. This includes 40x and 50x
responses from the server, which will be returned as `ServerParseError`. You can set up an error
link like this:

```js
import { ApolloClient, from, HttpLink } from "@apollo/client"
import { errorLink } from "graphql-error-handler"

const client = new ApolloClient({
  link: from([
    errorLink,
    new HttpLink({
      uri: "http://localhost:4000/graphql",
    }),
  ]),
})
```

### Guaranteeing `data` in components

There are also errors that can't be caught by the error link, and have to be taken care of at the
site of the `useQuery` and `useMutation` hooks.

Specifically, if there's an error in the resolver, you'll get a 200 response from your GraphQL
server and it will just return `errors` field. In addition if there's a problem in your query validation,
or if there is just a bad proxy or some other random problem, the hook will throw.

So, to handle all of those situations gracefully, you can wrap your mutation or query with a
`handleResult`:

```
import { handleResult } from 'graphql-error-handler'

const MyComponent = () => {
  const [createWhen] = useMutation(
    gql`
      mutation {
        myMutation {
          id
        }
      }
    `
  )

  const handleClick = () => {
    const { data } = await handleResult(createWhen)
    console.log(data.myMutation.id)
  }

  return <button onClick={handleClick}>Mutate</button>
}
```

Note that TypeScript will know that `data` is always going to be truthy, because `handleResult` will
throw a nice error in any other circumstance.

### Catching server errors in resolver tests:

Add a test helper like so:

```
import { handleResult } from 'graphql-error-handler';

export const getApolloQueryFunction = (apollo: ApolloServer) => {
  return async (query: Operation['query'], variables?: Operation['variables']) => {
    return await handleResult(apollo.executeOperation({ query, variables }))
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

### Catching parsing errors when loading .grapqhl files in Jest:

You can use graphql-tag to load .schema files in Jest, but if there's an error,
it won't tell you where it is. `graphql-error-handler` can help:

```
// jest-transform-graphql.js
const loader = require('graphql-tag/loader');
const { throwError } = require("graphql-error-handler")

module.exports = {
  process(src, filename) {
    // call directly the webpack loader with a mocked context
    // as graphql-tag/loader leverages `this.cacheable()`
    try {
      return loader.call({ cacheable() { } }, src);
    } catch (e) {
      handleLoaderError(e, src, filename)
    }
  },
};
```
