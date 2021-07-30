import auth from '@/services/auth.service'
import request from '@/services/request.service'
import leafLet from '@/services/leafLet.service'

/**
 * INJECTING NUXT AUTH SERVICES
 */
export default ({ app }, inject) => {
  inject('_auth_service', (service, ...args) => auth[service](...args, app))

  inject('_request_service', (...args) => request(...args, app))

  inject('_leafLet_service', (service, ...args) => leafLet[service](...args, app))
}
