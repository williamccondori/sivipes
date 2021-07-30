import { SET_ITEM_CONTEXT } from "@/store/mutations.types"

/**
 * setting project id on store from route param
 *
 */
export default function ({ store, route }) {
  store.commit(`projects/${SET_ITEM_CONTEXT}`, {id: route.params.id})
}
