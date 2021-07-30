import {SET_WMS_CAPABILITIES } from '@/store/mutations.types'

const API = '$portalAPI'

export const state = () => ({
  dataContext: [],
  wmsCapabilities: null
})

export const actions = {
  async getWMSCapabilities ({ commit }, id) {
    commit(SET_WMS_CAPABILITIES, null)
    const data = await this[API].getWMSCapabilities(id)
    commit(SET_WMS_CAPABILITIES, data)
  }
}

export const mutations = {
  [SET_WMS_CAPABILITIES]: (state, payload) => { state.wmsCapabilities = payload}
}
