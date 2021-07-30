import {
  SET_DATA_CONTEXT,
  SET_ITEM_CONTEXT,
  SET_SELECTED_SATELITAL_INDEX,
  SET_LAYER_SATELITAL_INDEX,
  SET_SIDE_BY_SIDE_VISIBLE
} from '@/store/mutations.types'

import {
  setDataContext,
  setItemContext
} from '@/use/store.mutations'

const API = '$satelitalIndexAPI'

export const state = () => ({
  dataContext: [],
  setItemContext: null,
  selectedSatelitalIndex: null,
  layerSatelitalIndex: [],
  sideBySideVisible: false
})

export const getters = {
  satelitalIndexes: state => {
    const { dataContext, sideBySideVisible, selectedSatelitalIndex } = JSON.parse(JSON.stringify(state))
    if (sideBySideVisible) {
      const itemId = selectedSatelitalIndex.id
      dataContext.forEach(val => {
        val.id === itemId ? val.isVisible = true : val.isVisible = false
      })
    } else {
      dataContext.forEach(val => {
        val.isVisible = false
      })
    }
    return dataContext
  }
}

export const actions = {
  async getDataContext ({ commit }, payload) {
    const data = await this[API].get(payload)
    data.forEach(val => {
      val.isVisible = false
    })
    commit(SET_DATA_CONTEXT, data)
  }
}

export const mutations = {
  [SET_DATA_CONTEXT]: setDataContext,
  [SET_ITEM_CONTEXT]: setItemContext,
  [SET_LAYER_SATELITAL_INDEX]: (state, payload) => (state.layerSatelitalIndex = payload),
  [SET_SELECTED_SATELITAL_INDEX]: (state, payload) => (state.selectedSatelitalIndex = payload),
  [SET_SIDE_BY_SIDE_VISIBLE]: (state, payload) => (state.sideBySideVisible = payload)
}
