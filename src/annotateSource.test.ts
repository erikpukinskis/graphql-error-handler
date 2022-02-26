import { annotateSource } from "./annotateSource"
import { SourceLocation } from "graphql"
import { describe, it, expect } from "vitest"

describe("annotateSource", () => {
  it("should mark the position in the query where the error occurred", () => {
    const query = `
      mutation($text: String!) {
        createWhens(text: $text)
      }
    `
    const location: SourceLocation = {
      line: 2,
      column: 3,
    }

    const annotated = annotateSource(query, location)

    const expected = [
      "GraphQL Query:",
      "",
      "  1 | mutation ($text: String!) {",
      "> 2 |   <<< ERROR OCCURRED HERE >>>createWhens(text: $text)",
      "  3 | }",
    ].join("\n")

    expect(annotated).toEqual(expected)
  })
})
