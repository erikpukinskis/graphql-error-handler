/* eslint-disable */
import * as graphql from "./graphql"
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"

const documents = {
  "\nmutation CreateTask($text: String!) {\n  createTask(text: $text) {\n    id\n    text\n  }\n}\n":
    graphql.CreateTaskDocument,
}

export function gql(
  source: "\nmutation CreateTask($text: String!) {\n  createTask(text: $text) {\n    id\n    text\n  }\n}\n"
): typeof documents["\nmutation CreateTask($text: String!) {\n  createTask(text: $text) {\n    id\n    text\n  }\n}\n"]

export function gql(source: string): unknown
export function gql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
