import {
  SET_DATA_CONTEXT
} from '@/store/mutations.types'

// PAGEACTIONS
export const getDataContext = api => async function ({ commit }) {
  const data = await this[api].get()
  commit(SET_DATA_CONTEXT, data)
}

export const create = api => async function ({}, form) {
  await this[api].create(form)
}

export const update = api => async function ({}, data) {
  await this[api].update(data)
}

export const deleteItemContext = api => async function ({}, id) {
  await this[api].delete(id)
}
