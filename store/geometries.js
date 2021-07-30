import {
  SET_OBJ_GEO_JSON,
} from '@/store/mutations.types'

const API = '$portalAPI'

export const state = () => ({
  dataContext: [],
  objGeoJSON: null
})

export const actions = {
  async getObjGeoJSON ({ commit }, form) {
    const data = await this[API].getObjGeoJSON(form)
    commit(SET_OBJ_GEO_JSON, data)
  },
}

export const mutations = {
  [SET_OBJ_GEO_JSON]: (state, payload) => { state.objGeoJSON = payload }
}
