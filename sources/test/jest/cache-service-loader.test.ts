import {describe, expect, it, jest, beforeEach} from '@jest/globals'

import type {CacheConfig} from '../../src/configuration'

describe('getCacheService selection logic', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
    })

    it('returns NoOpCacheService when cache is disabled', async () => {
        const {getCacheService} = await import('../../src/cache-service-loader')
        const mockConfig = {
            isCacheDisabled: () => true
        } as unknown as CacheConfig

        const service = await getCacheService(mockConfig)
        const report = await service.save('/home/.gradle', [], {
            disabled: true,
            readOnly: false,
            writeOnly: false,
            overwriteExisting: false,
            strictMatch: false,
            cleanup: 'never',
            includes: [],
            excludes: []
        })

        // NoOpCacheService returns a specific report mentioning cache was disabled
        expect(report).toContain('Cache was disabled')
    })

    it('returns BasicCacheService when cache is enabled', async () => {
        const {getCacheService} = await import('../../src/cache-service-loader')
        const {BasicCacheService} = await import('../../src/cache-service-basic')
        const mockConfig = {
            isCacheDisabled: () => false
        } as unknown as CacheConfig

        const service = await getCacheService(mockConfig)

        expect(service).toBeInstanceOf(BasicCacheService)
    })
})
