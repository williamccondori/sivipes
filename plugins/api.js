import baseAPI from '@/api/api.base'

import * as endpoints from '@/config/endpoints'

/**
 * injecting API ENDPOINTS
 */
export default (ctx, inject) => {
  for (const endpoint in endpoints) {
    const service = baseAPI(ctx.$axios)
    inject(endpoint, service(endpoints[endpoint]))
  }
}
