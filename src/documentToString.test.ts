import { documentToString } from './documentToString';
import { DocumentNode } from 'graphql';
import gql from "graphql-tag";

describe("documentToString", () => {
  it("should deindent", () => {
    const query = [
      "    mutation ($text: String!) {",
      "      createWhens(text: $text) {",
      "        id",
      "        storyId",
      "      }",
      "    }",
    ].join("\n")

    const lines = documentToString(query).split("\n")

    expect(lines[0]).toEqual('mutation ($text: String!) {')
  })

  it("should remove empty lines", () => {
    const query = [
      "",
      "  mutation ($text: String!) {",
      "    createWhens(text: $text)",
      "  }",
      "  ",
    ].join("\n")

    const lines = documentToString(query).split("\n")

    expect(lines).toHaveLength(3)
  })

  it("should ensure there's a space after mutation/query", () => {
    const query = [
      "mutation($text: String!) {",
      "  createWhens(text: $text)",
      "}",
    ].join("\n")

    const lines = documentToString(query).split("\n")

    expect(lines[0]).toEqual("mutation ($text: String!) {")
  })

  it("should work with a DocumentNode", () => {
    const doc = gql`
      query MeQuery($id: ID!) {
        me(id: $id)
      }
    `

    const lines = documentToString(doc).split("\n")

    expect(lines[0]).toEqual("query MeQuery($id: ID!) {")
  })
})
