/* eslint-disable array-bracket-newline */
/* eslint-disable array-element-newline */
import {
  ENABLE_SPINNER,
  DISABLE_SPINNER
} from '~/store/mutations.types'

export default async (...args) => {
  const [callback, spinnerType = null, app] = [...args]
  try {
    if (spinnerType) app.store.commit(`spinners/${ENABLE_SPINNER}`, spinnerType)

    await callback

  } catch (error) {
    throw Error(error)

  } finally {
    if (spinnerType) app.store.commit(`spinners/${DISABLE_SPINNER}`, spinnerType)
  }
}
