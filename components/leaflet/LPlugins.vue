
<script>
import { findRealParent } from "vue2-leaflet"
import { tileLayer, control } from "leaflet"

import L from "leaflet"
// Plugin minimap
import MiniMap from 'leaflet-minimap'
// Plugin mapas base
import layersControlMinimap from "@/node_modules/leaflet.layerscontrol-minimap/index"
import GPlaceAutocomplete from "leaflet-google-places-autocomplete"
import MousePosition from '@/static/leaflet/MousePosition.js'
// AIzaSyB3Vrtfjoi2AStH_4n7LWKwSrSkMpxGX3I

export default {
  data () {
    return {
      LMap: {},
      tileLayer: {
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
      },
      baseMaps: {}
    }
  },
  mounted () {

    this.$nextTick(() => {
      this.LMap = findRealParent(this.$parent).mapObject
      MousePosition({ emptyString: '-- : --' }).addTo(this.LMap)
      control.scale().addTo(this.LMap)
      //add input search
      this.addInputSearch()
      this.addLayerIDEP()
      // add Minimap
      this.addLayersMap()
      // add Minimap
      this.addMiniMap()
      // ass layer IDEP
    })
  },

  methods: {
    addInputSearch () {
      const _self = this
      new GPlaceAutocomplete({
        callback: function (place) {
          var location = place.geometry.location
          _self.LMap.panTo([
            location.lat(), location.lng()
          ])
          _self.LMap.setZoom(15)
        },
        position: "topleft"
      }).addTo(this.LMap)
    },
    addMiniMap () {
      let tilelayer = tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
      // let layer =
      new MiniMap(tilelayer, {
        toggleDisplay: true,
        zoomLevelFixed: false
      }).addTo(this.LMap)

    },
    addLayerIDEP () {
      let idep = L.tileLayer.wms("http://geo.ana.gob.pe/arcgis/services/SERV_CLASIFICACION_MARINA/MapServer/WMSServer",{
        zIndex:1500,
        layers: 0,
        service: "WMS",
        request :"GetMap",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        srs: "EPSG:3857",
        opacity: 0.2,
      }).addTo(this.LMap)
      console.log(idep)
      //tileLayer('http://geo.ana.gob.pe/arcgis/services/SERV_CLASIFICACION_MARINA/MapServer/WMSServer?request=GetCapabilities&service=WMS').addTo(this.LMap)
    },
    addLayersMap () {
      this.baseMaps['Open Street Map'] = tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',{zIndex : 1})
      this.baseMaps['Google Maps'] = tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',{zIndex : 1})
      this.baseMaps['Google Satellite'] = tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',{zIndex : 1})
      this.baseMaps['Google Hybrid'] = tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',{zIndex : 1})
      this.baseMaps['Google Terrain'] = tileLayer('https://mt1.google.com/vt/lyrs=t&x={x}&y={y}&z={z}',{zIndex : 1})
      this.baseMaps['Google Traffic'] = tileLayer('https://mt1.google.com/vt?lyrs=h@159000000,traffic|seconds_into_week:-1&style=3&x={x}&y={y}&z={z}',{zIndex : 1})
      this.baseMaps['Google Roads'] = tileLayer('https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}',{zIndex : 1})
      this.baseMaps['ESRI Imagery/Satellite'] = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{zIndex : 1})
      this.baseMaps['ESRI National Geographic'] = tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',{zIndex : 1})
      this.baseMaps['ESRI Streets'] = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',{zIndex : 1})
      this.baseMaps['ESRI Topo'] = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',{zIndex : 1})
      let maps = layersControlMinimap(this.baseMaps)
      maps.addTo(this.LMap)

    }
  },

  render: () => ({})
}
</script>

<style>
</style>
