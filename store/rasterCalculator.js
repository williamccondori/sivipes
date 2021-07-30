import {
  SET_DATA_CONTEXT,
  SET_RESULT_FROM_RASTER_CALCULATOR
} from '@/store/mutations.types'

import { setDataContext } from '@/use/store.mutations'

const API = '$calculatorAPI'

export const state = () => ({
  dataContext: [],
  resultFromRasterCalculator: null
})

export const actions = {
  async getResultFromRasterCalculator ({ commit }, form) {
    const data = await this[API].create(form)
    commit(SET_RESULT_FROM_RASTER_CALCULATOR, data)
  }
}

export const mutations = {
  [SET_DATA_CONTEXT]: setDataContext,
  [SET_RESULT_FROM_RASTER_CALCULATOR]: (state, payload) => (state.resultFromRasterCalculator = payload)
}
