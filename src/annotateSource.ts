import { SourceLocation, DocumentNode } from "graphql"
import { documentToString } from "./documentToString"

export const annotateSource = (
  source: string | DocumentNode,
  location: SourceLocation,
  filename?: string
) => {
  const lines = documentToString(source).split("\n")
  const errorLineNumber = location.line
  const column = location.column - 1
  const outputStart = Math.max(0, errorLineNumber - 3)
  const outputEnd = Math.min(lines.length, errorLineNumber + 3)

  const line = lines[errorLineNumber - 1]
  lines[errorLineNumber - 1] =
    line.substr(0, column) + "<<< ERROR OCCURRED HERE >>>" + line.substr(column)

  const output = lines.slice(outputStart, outputEnd).map((line, i) => {
    const lineNumber = outputStart + i + 1
    const padded = lineNumber.toString().padStart(Math.log10(lines.length), " ")
    const symbol = lineNumber === errorLineNumber ? ">" : " "
    return `${symbol} ${padded} | ${line}`
  })

  return `${filename || "GraphQL Query:"}\n\n${output.join("\n")}`
}
