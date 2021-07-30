import Vue from 'vue'

import { Icon } from 'leaflet'

delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

/**
 * injecting observable variable to get context of LDraw component
 * to get access to his methods
 */
const L = Vue.observable({
  DRAW: null,
  map: null,
  tempLayers: null,
  projectLayers: null,
  WMSSatelitalLayers: null,
  WMSProjectLayers: null
})

export default ({}, inject) => {
  inject('L', L)
}
