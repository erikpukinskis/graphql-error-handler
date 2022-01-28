import NetworkError from './test/NetworkError.json'
import ServerParseError from './test/ServerParseError.json'
import ValidationFailed from './test/ValidationFailed.json'
import { handleResult } from "./handleResult"

describe("handleResult", () => {
  it("should proxy through data if there's no error", async () => {
    const operation = new Promise((resolve) => {
      resolve({
        data: {
          myQuery: {
            id: 2
          }
        }
      })
    })

    const result = await handleResult(operation)
    expect(result).toHaveProperty("data.myQuery.id", 2)
  })

  it("should work on a NetworkError", async() => {
    const operation = (async () => {
      const error = new Error()
      Object.assign(error, NetworkError)
      throw error
    })()

    // await expect(async () => {
    //   await operation
    // }).rejects.toThrow()

    try {
      await handleResult(operation)
    } catch (e) {
      expect(e.message).toMatch("<<< ERROR OCCURRED HERE >>>createWhens")
      expect(e.message).toMatch("handleResult.test.ts")
      return
    }
    throw new Error("no error was caught")
  })

  it("should work on a validation failure", async() => {
    const operation = (async () => {
      const error = new Error()
      Object.assign(error, ValidationFailed)
      throw error
    })()

    try {
      await handleResult(operation)
    } catch (e) {
      expect(e.message).toMatch("<<< ERROR OCCURRED HERE >>>createWhens")
      expect(e.message).toMatch("handleResult.test.ts")
      return
    }
    throw new Error("no error was caught")
  })

  it("should work on a server parse error", async() => {
    const operation = (async () => {
      const error = new Error()
      Object.assign(error, ServerParseError)
      throw error
    })()

    try {
      await handleResult(operation)
    } catch (e) {
      expect(e.message).toMatch("Unexpected token < in JSON at position 0")
      return
    }
    throw new Error("no error was caught")
  })
})