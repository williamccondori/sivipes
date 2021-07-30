<script>
import SideBySide from 'leaflet-side-by-side'
import { tileLayer, geoJSON } from 'leaflet'
import { findRealParent } from "vue2-leaflet"
import { mapState } from 'vuex'

export default {
  data () {
    return {
      LMap: {},
      leftLayer: null,
      rightLayer: null,
      LSideBySide: null,
      geometryLayers: null
    }
  },
  computed: {
    ...mapState({
      sideBySideVisible: (state) => state.satelitalIndexes.sideBySideVisible,
      satelitalIndex: (state) => state.satelitalIndexes.layerSatelitalIndex
    })
  },

  watch: {
    satelitalIndex: function (val) {
      if (val.length && !this.LSideBySide) {
        this.addSideBySide(val[0], val[1])
      } else {
        this.removeSideBySide()
        this.addSideBySide(val[0], val[1])
      }
    },
    sideBySideVisible: function (val) {
      if (!val) this.removeSideBySide()
    }
  },
  mounted () {
    this.LMap = findRealParent(this.$parent).mapObject
  },

  methods: {
    addSideBySide (layerBase, layerResult) {
      // geometry
      this.getBoundsLayers(layerBase.geometry)

      this.leftLayer = tileLayer.wms(layerBase.baseUrl, {
        layers: layerBase.layer,
        format: 'image/png',
        transparent: true,
        zIndex: 110
      })
      this.LMap.addLayer(this.leftLayer)

      this.rightLayer = tileLayer.wms(layerResult.baseUrl, {
        layers: layerResult.layer,
        format: 'image/png',
        transparent: true,
        zIndex: 110
      })
      this.LMap.addLayer(this.rightLayer)

      this.$nextTick(() => {
        this.LSideBySide = SideBySide(this.leftLayer, this.rightLayer).addTo(this.LMap)
      })
    },

    removeSideBySide () {
      this.LMap.removeControl(this.LSideBySide)
      this.LMap.removeLayer(this.leftLayer)
      this.LMap.removeLayer(this.rightLayer)
      this.LSideBySide = null
      this.leftLayer = null
      this.rightLayer = null
    },

    getBoundsLayers (geometry) {
      const parseGeometry = JSON.parse(geometry)
      this.LMap.fitBounds(geoJSON(parseGeometry).getBounds())
    }
  },

  render: () => ({})
}
</script>
