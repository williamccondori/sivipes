import {
  SET_DATA_CONTEXT,
  SET_ITEM_CONTEXT,
  SET_SATELITAL_IMAGES_FILTERED,
  TOGGLE_VISIBLE_LAYER,
  SET_SATELITAL_IMAGES_BANDS
} from '@/store/mutations.types'

import {
  setItemContext
} from '@/use/store.mutations'

const API = '$satelitalImageAPI'

export const state = () => ({
  dataContext: [],
  satelitalImagesFiltered: [],
  bands: [],
  itemContext: null
})

export const actions = {
  getDataContext: async function ({ commit }, payload) {
    const data = await this[API].getSatelitalImages(payload)
    commit(SET_DATA_CONTEXT, data)
  },
  search: async function ({ commit }, form) {
    const data = await this[API].search(form)
    commit(SET_SATELITAL_IMAGES_FILTERED, data)
  },
  getBands: async function ({ commit }) {
    const data = await this[API].getBands()
    commit(SET_SATELITAL_IMAGES_BANDS, data)
  }
}

export const mutations = {
  [SET_DATA_CONTEXT]: (state, payload) => {
    state.dataContext = []

    if (payload.length) {
      payload.forEach(item => {
        state.dataContext.push({
          ...item,
          visible: false
        })
      })
    }
  },

  [SET_SATELITAL_IMAGES_FILTERED]: (state, payload) => {
    state.satelitalImagesFiltered = []

    if (payload.length) {
      payload.forEach(item => {
        state.satelitalImagesFiltered.push({
          ...item,
          visible: false
        })
      })
    }
  },

  [TOGGLE_VISIBLE_LAYER]: (state, payload) => {
    const layerIndex = state[payload.stateContext].findIndex(sif => sif.id === payload.layer.id)

    state[payload.stateContext][layerIndex].visible = !state[payload.stateContext][layerIndex].visible
  },

  [SET_SATELITAL_IMAGES_BANDS]: (state, payload) => {
    state.bands = payload
  },
  [SET_ITEM_CONTEXT]: setItemContext
}
