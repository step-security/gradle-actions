import {CacheConfig} from './configuration'
import {BasicCacheService} from './cache-service-basic'
import {BuildResult} from './build-results'
import {CacheOptions, CacheService} from './cache-service'

const NOOP_CACHING_REPORT = `
[Cache was disabled](https://github.com/step-security/gradle-actions/blob/main/docs/setup-gradle.md#disabling-caching). Gradle User Home was not restored from or saved to the cache.
`

class NoOpCacheService implements CacheService {
    async restore(_gradleUserHome: string, _cacheOptions: CacheOptions): Promise<void> {
        return
    }

    async save(_gradleUserHome: string, _buildResults: BuildResult[], _cacheOptions: CacheOptions): Promise<string> {
        return NOOP_CACHING_REPORT
    }
}

export async function getCacheService(cacheConfig: CacheConfig): Promise<CacheService> {
    if (cacheConfig.isCacheDisabled()) {
        logCacheMessage('Cache is disabled: will not restore state from previous builds.')
        return new NoOpCacheService()
    }

    return new BasicCacheService()
}

export function logCacheMessage(message: string): void {
    console.info(message)
}
