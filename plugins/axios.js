import { $_notify_error } from "@/use/notifications"

import { ERRORS } from '@/config/messages'

export default async ({ app, $axios, redirect }) => {
  $axios.onRequest((config) => {
    //  custom functionality to set project id
    if (config.method !== 'get') {
      try {
        config.data.set('project_id', app.store.state.projects.itemContext.id)
      } catch {
      }
    } else {
      try {
        config.url += `?project_id=${app.store.state.projects.itemContext.id}`
      } catch {
      }
    }
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)

    // handle message error from server or default error message
    let errorMessage = ''

    switch (code) {
    case 'ECONNABORTED': // time expired for request
      errorMessage = ERRORS.ERROR_TRY_LATER
      break
    case 401:
      errorMessage = ERRORS.UNAUTHORIZED
      app.store.commit('auth/SET', { key: 'user', value: null })
      app.store.commit('auth/SET', { key: 'loggedIn', value: false })
      redirect('/login')
      break
    case 404:
      errorMessage = ERRORS.ROUTE_NOT_FOUND
      break
    case 422:
      errorMessage = ERRORS.INVALID_DATA
      break
    default:
      errorMessage =
        typeof error.response !== 'undefined'
          ? error.response.data.message || error.response.data
          : ERRORS.ERROR_TRY_LATER
    }
    $_notify_error(errorMessage)
  })
}
