/* eslint-disable array-bracket-newline */
/* eslint-disable array-element-newline */
import { SERVICES } from './services.types'

import { geoJson } from "leaflet"

import {
  SET_ACTIVE_VISIBLE_POLYGONS_BUTTONS,
  SET_ACTIVE_VISIBLE_POLYGON_BUTTON,
  SPINNERS,
  TOGGLE_VISIBLE_LAYER
} from '@/store/mutations.types'

export default {
  [SERVICES.LEAFLET.FIND_PROJECT_LAYER_BY_POLYGON_ID]: function (id, app) {
    let layerFound = null

    app.$L.projectLayers.eachLayer(layer => {
      layer.eachLayer(l => {
        if (l.feature.properties.id === id) layerFound = layer
      })
    })
    return layerFound
  },

  [SERVICES.LEAFLET.DELETE_LAYER]: function (...args) {
    const [layer, groupLayers] = [...args]
    groupLayers.removeLayer(layer)
  },

  [SERVICES.LEAFLET.VIEW_PROJECT_LAYER]: function (...args) {
    const [polygon, app] = [...args]
    const layerExists = this[SERVICES.LEAFLET.FIND_PROJECT_LAYER_BY_POLYGON_ID](polygon.id, app)
    let polygonId = null

    if (layerExists) {
      this[SERVICES.LEAFLET.DELETE_LAYER](layerExists, app.$L.projectLayers)
      polygonId = polygon.id

    } else {
      const layerCreated = geoJson({
        type: "Feature",
        properties: {
          id: polygon.id,
          visible: true,
          hightLighted: false
        },
        geometry: JSON.parse(polygon.geometry)
      }).addTo(app.$L.projectLayers)

      app.$L.map.fitBounds(layerCreated.getBounds(), {
        paddingBottomRight: [
          300, 0
        ]
      })
      for (const key in layerCreated._layers) {
        polygonId = layerCreated._layers[key].feature.properties.id
      }
    }

    app.store.commit(`polygons/${SET_ACTIVE_VISIBLE_POLYGON_BUTTON}`, polygonId)
  },

  [SERVICES.LEAFLET.GET_LAYERS]: function (...args) {
    const [groupLayers] = [...args]
    return groupLayers.getLayers()
  },

  [SERVICES.LEAFLET.HIGHLIGHT_LAYER]: function (...args) {
    const [layer] = [...args]
    console.warn(layer)

    // else {
    //   polygonCreated.setStyle({fillColor :'cyan'})
    // }
    layer.setStyle({fillColor :'cyan'})
    setTimeout(() => {
      layer.resetStyle()
    }, 1000)
  },

  /**
   *
   * @param  {...any} args
   */
  [SERVICES.LEAFLET.FETCH_PROJECT_LAYERS]: async function (...args) {
    const [groupLayers, app] = [...args]
    const layersIds = []

    try {
      await app.$_request_service(app.store.dispatch('polygons/getDataContext'), SPINNERS.LOADING_DRAWER)

      groupLayers.eachLayer(layer => {
        layer.eachLayer(l => {
          layersIds.push(l.feature.properties.id)
        })
      })

      app.store.commit(`polygons/${SET_ACTIVE_VISIBLE_POLYGONS_BUTTONS}`, layersIds)
    } catch (error) {
    }
  },

  [SERVICES.LEAFLET.VIEW_LAYER]: function (...args) {
    // eslint-disable-next-line no-unused-vars
    const [layer, groupLayers, storeNamespace, stateContext, app] = [...args]
    groupLayers.removeLayer(layer.leafLetLayer)
    if (layer.visible) {
      groupLayers.removeLayer(layer.leafLetLayer)
    } else {
      const layerTosetBounds = geoJson(JSON.parse(layer.geometry))
      console.log(layer)
      this[SERVICES.LEAFLET.SET_BOUNDS](layerTosetBounds, app)

      app.$L.map.removeLayer(layerTosetBounds)
    }
    app.store.commit(`${storeNamespace}/${TOGGLE_VISIBLE_LAYER}`, {
      layer,
      stateContext
    })
  },

  [SERVICES.LEAFLET.SET_BOUNDS]: function (...args) {
    const[layer, app] = [...args]
    app.$L.map.fitBounds(layer.getBounds(), {
      paddingBottomRight: [
        300, 0
      ]
    })
  }
}
