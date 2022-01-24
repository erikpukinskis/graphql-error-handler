import { throwError } from "./throwError";

export const handleLoaderError = (e: Error, operationSource: string, filename: string) => {
  throwError(e.message, operationSource, undefined, e.stack, filename)
}

