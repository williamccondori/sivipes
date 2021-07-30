/* eslint-disable array-bracket-newline */
/* eslint-disable array-element-newline */
/**
 ** NUXT AUTH SERVICES
 */
import { $_notify_success } from '@/use/notifications'

import { AUTH_STRATEGY } from '@/config/constants'

import { SESSION } from '@/config/messages'

import {
  ENABLE_SPINNER,
  DISABLE_SPINNER,
  SPINNERS
} from '@/store/mutations.types'

import { SERVICES } from './services.types'

export default {
  [SERVICES.AUTH.SIGN_IN]: async (...args) => {
    const [data, app] = [...args]
    try {
      app.store.commit(`spinners/${ENABLE_SPINNER}`, SPINNERS.PROCESSING_FORM)

      await app.$auth.loginWith(AUTH_STRATEGY, { data })

      $_notify_success('Bienvenido', SESSION.STARTED)
    } catch (error) {
    }
    app.store.commit(`spinners/${DISABLE_SPINNER}`, SPINNERS.PROCESSING_FORM)
  },

  [SERVICES.AUTH.SIGN_OUT]: async app => {
    try {
      app.store.commit(`spinners/${ENABLE_SPINNER}`, SPINNERS.LOADING_PAGE)

      await app.$auth.logout()

      $_notify_success('', SESSION.ENDED)
    } catch (error) {
      app.$auth.setToken(AUTH_STRATEGY, null)
    }
    app.store.commit(`spinners/${DISABLE_SPINNER}`, SPINNERS.LOADING_PAGE)
  }
}
