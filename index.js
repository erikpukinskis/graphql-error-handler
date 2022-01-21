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

module.exports = (error, query, filename) => {
  const lines = getSource(query).split("\n")
  const errorLineNumber = error.locations[0].line
  const column = error.locations[0].column - 1
  const outputStart = Math.max(0, errorLineNumber - 3)
  const outputEnd = Math.min(lines.length, errorLineNumber + 3)

  const line = lines[errorLineNumber - 1]
  lines[errorLineNumber - 1] = line.substr(0, column) + "<<< ERROR OCCURRED HERE >>>" + line.substr(column)

  const output = lines.slice(outputStart, outputEnd).map((line, i) => {
    const lineNumber = outputStart + i + 1
    const padded = lineNumber.toString().padStart(Math.log10(lines.length), ' ')
    const symbol = lineNumber === errorLineNumber ? '>' : ' '
    return `${symbol} ${padded} | ${line}`
  })

  const annotatedQuery = `${filename || 'GraphQL Query:'}\n\n${output.join("\n")}`


  error.message = `${error.originalError.stack}\n${annotatedQuery}\n`

  throw error
}

const getSource = (query) => {
  if (typeof query === "string") return query
  else return query.loc.source.body
}