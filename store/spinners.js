import {
  ENABLE_SPINNER,
  DISABLE_SPINNER,
  SPINNERS
} from './mutations.types'

export const state = () => ({
  [SPINNERS.PROCESSING_FORM]: false,
  [SPINNERS.LOADING_DRAWER]: false,
  [SPINNERS.LOADING_PAGE]: false
})

export const mutations = {
  [ENABLE_SPINNER]: (state, payload) => (state[payload] = true),

  [DISABLE_SPINNER]: (state, payload) => (state[payload] = false)
}
