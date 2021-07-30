<template>
<list-polygon
  v-loading="$store.state.spinners.LOADING_DRAWER"
  :polygons="polygons"
  @view-polygon="viewPolygon"
  @delete-polygon="deletePolygon"
/>
</template>

<script>
import ListPolygon from '@/components/polygons/ListPolygon'

import mountableAsDynamicMixin from "@/mixins/mountableAsDynamic.mixin"

import { mapState } from "vuex"

import { $_notify_success } from '@/use/notifications'
import { SERVICES } from '@/services/services.types'
import { SUCCESS } from '@/config/messages'
import {
  SPINNERS
} from '@/store/mutations.types'

export default {
  components: {
    ListPolygon
  },

  mixins: [mountableAsDynamicMixin],

  data: () => ({
    // defined if mountableAsDynamicMixin is included
    dynamicTitle: 'Áreas - Polígonos'
  }),

  computed: {
    ...mapState({
      polygons: (state) => state.polygons.dataContext
    })
  },

  created () {
    this.init()
  },

  methods: {
    /**
     * ViewPolygon handler
     * @param {Layer<Leaflet>}
     */
    viewPolygon (polygon) {
      this.$_leafLet_service(SERVICES.LEAFLET.VIEW_PROJECT_LAYER, polygon)
    },

    /**
     * deletePolygon handler
     * @param {Layer<Leaflet>}
     */
    async deletePolygon (polygon) {
      try {
        await this.$_request_service(this.$store.dispatch('polygons/deleteItemContext', polygon.id), SPINNERS.LOADING_DRAWER)

        const polygonExists = this.$_leafLet_service(SERVICES.LEAFLET.FIND_PROJECT_LAYER_BY_POLYGON_ID, polygon.id)

        if (polygonExists) this.$_leafLet_service(SERVICES.LEAFLET.DELETE_LAYER, polygonExists, this.$L.projectLayers)

        await this.$_leafLet_service(SERVICES.LEAFLET.FETCH_PROJECT_LAYERS, this.$L.projectLayers)

        $_notify_success(SUCCESS.DELETED)
      } catch (error) {
      }
    },

    async init () {
      try {
        await this.$_leafLet_service(SERVICES.LEAFLET.FETCH_PROJECT_LAYERS, this.$L.projectLayers)
      } catch (error) {
      }
    }
  }
}
</script>
