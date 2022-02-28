import { buildError } from "./buildError"

export const handleLoaderError = (
  e: Error,
  operationSource: string,
  filename: string
) => {
  throw buildError(e.message, operationSource, undefined, e.stack, filename)
}
