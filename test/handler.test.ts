import { handleRequest } from '../src/handler'
import makeServiceWorkerEnv from 'service-worker-mock'

declare var telegram_kv: { get: (name: string) => string }
declare var global: any

describe('handle', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv())
    Object.assign(global, {
      telegram_kv: {
        get: (name: string) => Promise.resolve('test:test')
      }
    })
    jest.resetModules()
  })

  it('Should replace telegram_token for test suite', async () => {
    expect(await telegram_kv.get('telegram_token')).toBe('test:test')
  })
})
