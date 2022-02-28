import {
  useMutation,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client"
import { handleResult } from "../../handleResult"
import React, { useState } from "react"
import { gql } from "./gql"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { graphql, GraphQLContext, GraphQLRequest, ResponseResolver } from "msw"
import { setupServer } from "msw/node"
import { describe, beforeAll, afterEach, afterAll, it } from "vitest"
import fetch from "cross-fetch"

const query = gql(`
mutation CreateTask($text: String!) {
  createTask(text: $text) {
    id
    text
  }
}
`)

const executeOperation: ResponseResolver<
  GraphQLRequest<Record<string, unknown>>,
  GraphQLContext<Record<string, unknown>>
> = async (
  {
    body: {
      variables: { text },
    },
  },
  res,
  ctx
) => {
  return res(
    ctx.data({
      createTask: {
        id: "42",
        text,
      },
    })
  )
}

const server = setupServer(graphql.mutation(/./, executeOperation))

const APOLLO_CLIENT = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
    fetch,
  }),
})

const Component = () => {
  const [createTask] = useMutation(query, { client: APOLLO_CLIENT })
  const [id, setId] = useState("")

  const handleClick = async () => {
    const result = await handleResult(
      createTask({ variables: { text: "hello" } })
    )
    const {
      data: { createTask: task },
    } = result
    setId(task.id)
  }

  return (
    <>
      <div>Id: {id}</div>
      <button onClick={handleClick}>Click me</button>
    </>
  )
}

describe("a mutation with types generated by gql-tag-operations-preset", () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it("should work", async () => {
    render(<Component />)

    const button = await screen.findByRole("button")
    userEvent.click(button)

    await waitFor(() => screen.findByText("Id: 42"))
  })
})
