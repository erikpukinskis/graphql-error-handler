import NetworkError from './test/NetworkError.json'
import ServerParseError from './test/ServerParseError502.json'
import ValidationFailed from './test/ValidationFailed.json'
import { handleResult } from "./handleResult"
import { describe, it, expect } from 'vitest'
import type { FetchResult } from '@apollo/client';

describe("handleResult", () => {
  it("should proxy through data if there's no error", async () => {
    const operation = new Promise<FetchResult>((resolve) => {
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
      const message = (e as Error).message
      expect(message).toMatch("<<< ERROR OCCURRED HERE >>>createWhens")
      expect(message).toMatch("handleResult.test.ts")
      expect(message).not.toMatch("Spare Error")
      return
    }
    throw new Error("no error was caught")
  })

  it("should work on a ValidationFailed error", async() => {
    const operation = (async () => {
      const error = new Error()
      Object.assign(error, ValidationFailed)
      throw error
    })()

    try {
      await handleResult(operation)
    } catch (e) {
      const message = (e as Error).message
      expect(message).toMatch("<<< ERROR OCCURRED HERE >>>createWhens")
      expect(message).toMatch("handleResult.test.ts")
      expect(message).not.toMatch("Spare Error")
      return
    }
    throw new Error("no error was caught")
  })

  it("should work on a ServerParseError", async() => {
    const operation = (async () => {
      const error = new Error()
      Object.assign(error, ServerParseError)
      throw error
    })()

    try {
      await handleResult(operation)
    } catch (e) {
      const message = (e as Error).message
      expect(message).toMatch("Unexpected token < in JSON at position 0")
      expect(message).not.toMatch("Spare Error")
      return
    }
    throw new Error("no error was caught")
  })
})