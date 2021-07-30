import {
  SET_DATA_CONTEXT,
  SET_ITEM_CONTEXT
} from '@/store/mutations.types'

import {
  setDataContext,
  setItemContext
} from '@/use/store.mutations'

import {
  getDataContext,
  create,
  deleteItemContext,
  update
} from '@/use/store.actions'

const API = '$projectAPI'

export const state = () => ({
  dataContext: [],
  itemContext: null
})

export const actions = {
  getDataContext: getDataContext(API),

  async getItemContext ({ commit }, id) {
    const data = await this[API].getById(id)
    commit(SET_ITEM_CONTEXT, data)
  },

  create: create(API),

  update: update(API),

  deleteItemContext: deleteItemContext(API),

  addToProject: async function ({}, form) {
    await this[API].addToProject(form)
  }
}

export const mutations = {
  [SET_DATA_CONTEXT]: setDataContext,

  [SET_ITEM_CONTEXT]: setItemContext
}
