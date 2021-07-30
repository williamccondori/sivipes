import {
  SET_DATA_CONTEXT,
  SET_ACTIVE_VISIBLE_POLYGON_BUTTON,
  SET_ACTIVE_VISIBLE_POLYGONS_BUTTONS
} from '@/store/mutations.types'

import {
  create,
  deleteItemContext
} from '@/use/store.actions'

const API = '$polygonAPI'

export const state = () => ({
  dataContext: []
})

export const actions = {
  getDataContext: async function ({ commit }) {
    const data = await this[API].getPolygons()
    commit(SET_DATA_CONTEXT, data)
  },

  create: create(API),

  deleteItemContext: deleteItemContext(API)
}

export const mutations = {
  [SET_DATA_CONTEXT]: (state, payload) => {
    state.dataContext = payload.map(item => ({...item, visible: false }))
  },

  [SET_ACTIVE_VISIBLE_POLYGON_BUTTON]: (state, payload) => {
    const dataContextIndex = state.dataContext.findIndex(itemContext => itemContext.id === payload)
    state.dataContext[dataContextIndex].visible = !state.dataContext[dataContextIndex].visible
  },

  [SET_ACTIVE_VISIBLE_POLYGONS_BUTTONS]: (state, payload) => {
    payload.forEach(id => {
      const dataContextIndex = state.dataContext.findIndex(itemContext => itemContext.id === id)
      state.dataContext[dataContextIndex].visible = true
    })
  }
}
