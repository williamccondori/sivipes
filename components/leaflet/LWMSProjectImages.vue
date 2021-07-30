<template>
<l-feature-group @ready="onReadyFeatureGroup">
  <l-w-m-s-tile-layer
    v-for="(layer, index) in projectImages" :key="index"
    :base-url="layer.url"
    :layers="layer.layer"
    :transparent="true"
    :visible="layer.visible"
    layer-type="overlay"
    format="image/png"
    :z-index="100"
    :tile-size="733"
  />
</l-feature-group>
</template>

<script>
import {
  LFeatureGroup,
  LWMSTileLayer
} from "vue2-leaflet"

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
      projectImages: state => state.satelitalImages.dataContext
    })
  },

  methods: {
    onReadyFeatureGroup (featureGroupMapObject) {
      this.$emit('ready-wms-satelital-layers', featureGroupMapObject)
    }
  }
}
</script>
