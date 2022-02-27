/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Mutation = {
  __typename?: "Mutation"
  createTask: Task
}

export type MutationCreateTaskArgs = {
  text: Scalars["String"]
}

export type Task = {
  __typename?: "Task"
  id: Scalars["ID"]
  text: Scalars["String"]
}

export type CreateTaskMutationVariables = Exact<{
  text: Scalars["String"]
}>

export type CreateTaskMutation = {
  __typename?: "Mutation"
  createTask: { __typename?: "Task"; id: string; text: string }
}

export const CreateTaskDocument = {
  "kind": "Document",
  "definitions": [
    {
      "kind": "OperationDefinition",
      "operation": "mutation",
      "name": { "kind": "Name", "value": "CreateTask" },
      "variableDefinitions": [
        {
          "kind": "VariableDefinition",
          "variable": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "text" },
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": { "kind": "Name", "value": "String" },
            },
          },
        },
      ],
      "selectionSet": {
        "kind": "SelectionSet",
        "selections": [
          {
            "kind": "Field",
            "name": { "kind": "Name", "value": "createTask" },
            "arguments": [
              {
                "kind": "Argument",
                "name": { "kind": "Name", "value": "text" },
                "value": {
                  "kind": "Variable",
                  "name": { "kind": "Name", "value": "text" },
                },
              },
            ],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [
                { "kind": "Field", "name": { "kind": "Name", "value": "id" } },
                {
                  "kind": "Field",
                  "name": { "kind": "Name", "value": "text" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateTaskMutation, CreateTaskMutationVariables>
