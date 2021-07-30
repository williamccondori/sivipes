<template>
<l-feature-group @ready="onReadyFeatureGroup" />
</template>

<script>
/**
 * Listener on click buttons to bindPopup menu buttons
 * accessing to vue.obserbable $LDraw instance component
 */
document.body.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON' && e.target.classList.contains('btn-leaflet-popup')) {
    const action = e.target.getAttribute('data-action')
    const id = Number(e.target.getAttribute('data-leaflet-id'))
    // eslint-disable-next-line no-undef
    $nuxt.$L.DRAW.onClickBtnPopupMenu(action, id)
  }
})

import {
  Draw,
  Control
} from 'leaflet'

import { LFeatureGroup } from 'vue2-leaflet'

import 'leaflet-draw'

export default {
  components: {
    LFeatureGroup
  },

  methods: {
    onReadyFeatureGroup (LFeatureGroupMapObject) {
      // getting featureGroup.mapObject reference from <l-feature-group> component
      this.$L.tempLayers = LFeatureGroupMapObject
      this.init()
    },

    init () {
      /**
     * assigning context on Vue.observable to be access from outside Vue instance
     *
     * @instance <l-draw> component reference
     */
      this.$L.DRAW = this

      this.$L.map.addLayer(this.$L.tempLayers)

      this.mapObject = new Control.Draw({
        edit: {
          featureGroup: this.$L.tempLayers
        },
        // draw settings
        draw: {
          marker: false,
          circle: false,
          circlemarker: false
        }
      })

      this.$L.map.addControl(this.mapObject)

      this.$L.tempLayers.addTo(this.$L.map)

      // Lmap events with leaflet-draw plugin
      this.onDrawCREATED()
      /**
     * TODO: DRAW EVENTS
     */

      this.$nextTick(() => {
        this.$emit('ready', this.mapObject)
      })
    },

    /**
     * Lmap @event CREATED
     * @package leaflet-draw
     */
    onDrawCREATED () {
      this.$L.map.on(Draw.Event.CREATED, ({ layer }) => {
        this.$L.tempLayers.addLayer(layer)
        // bindPopup Menu to layer created
        layer.bindPopup(this.popupTemplate(layer._leaflet_id)).openPopup()
      })
    },

    /**
     * from popupMenu buttons, action & _leaflet_id
     * @param {String, int}
     */
    onClickBtnPopupMenu (action, id) {
      let polygonLayer = null

      this.$L.tempLayers.eachLayer(layer => {
        if (layer._leaflet_id === id) polygonLayer = layer
      })

      switch (action) {
      case 'add':
        this.onAddPolygon(polygonLayer)
        break
      case 'edit':
        this.onEditPolygon(polygonLayer)
        break
      case 'delete':
        this.onDeletePolygon(polygonLayer)
        break
      }
    },

    /**
     * @emits add-polygon
     * @param {Layer<Leaflet>}
     */
    onAddPolygon (layer) {
      this.$emit('add-polygon', layer)
    },

    /**
     * toggle styles when is editing mode
     * @param {Layer<Leaflet>}
     */
    onEditPolygon (layer) {
      if (layer.editing.enabled()) {
        layer.setStyle({
          fillColor :'#3388ff',
          fillOpacity: "0.2",
          dashArray: '',
          strokeWidth: '4'
        })
        layer.editing.disable()
      }
      else {
        layer.setStyle({
          fillColor :'#fe57a1',
          fillOpacity: "0.1",
          dashArray: '10, 10',
          strokeWidth: '4'
        })
        layer.editing.enable()
      }
    },

    /**
     * @emits delete-polygon
     * @param {Layer<Leaflet>}
     */
    onDeletePolygon (layer) {
      this.$L.tempLayers.removeLayer(layer)
    },

    /**
     * custom popup menu buttons template
     *
     * @param {id}
     */
    popupTemplate (id) {
      return `
        <button 
          data-tooltip="guardar"
          data-leaflet-id="${id}"
          data-action="add"
          class="btn-leaflet-popup el-button el-button--success is-circle"
        >
          <i class="el-icon-circle-plus-outline"></i>
        </button>
        <button 
          data-tooltip="editar"
          data-leaflet-id="${id}"
          data-action="edit"
          class="btn-leaflet-popup el-button el-button--warning is-circle"
        >
          <i class="el-icon-edit"></i>
        </button>
        <button 
          data-tooltip="eliminar"
          data-leaflet-id="${id}"
          data-action="delete"
          class="btn-leaflet-popup el-button el-button--danger is-circle"
        >
          <i class="el-icon-delete"></i>
        </button>
      `
    }
  }
}
</script>
