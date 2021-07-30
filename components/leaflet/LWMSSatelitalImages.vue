<template>
<l-feature-group @ready="onReadyFeatureGroup">
  <l-w-m-s-tile-layer
    v-for="(layer, index) in satelitalImagesFiltered" :key="index"
    :base-url="layer.url"
    :layers="layer.layer"
    :transparent="true"
    :visible="layer.visible"
    layer-type="overlay"
    format="image/png"
    :z-index="2"
    :tile-size="1980"
    :zoom-offset="-1"
  />
</l-feature-group>
</template>

<script>
import {LFeatureGroup, LWMSTileLayer } from "vue2-leaflet"

import { mapState } from 'vuex'

export default {
  components: {
    LWMSTileLayer,
    LFeatureGroup
  },

  data () {
    return {}
  },

  computed: {
    ...mapState({
      satelitalImagesFiltered: state => state.satelitalImages.satelitalImagesFiltered
    })
  },

  methods: {
    onReadyFeatureGroup (featureGroupMapObject) {
      this.$emit('ready-wms-satelital-layers', featureGroupMapObject)
    }
  }
}
</script>
