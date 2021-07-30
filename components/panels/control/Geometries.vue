<template>
<div>
  <div class="text-center">
    <upload-file
      :file="file"
      @on-file-valid="$_uploadFileMixin_valid"
      @delete-file="$_uploadFileMixin_clear()"
      @apply-after-upload-file="applyAfterUploadFile"
    />
  </div>
  <el-card
    v-if="objGeoJSON"
    shadow="hover"
  >
    <div class="center-between">
      <h5 class="ma-0">{{ infoFile.name }} <br><small>{{ infoFile.leafletId }}</small> </h5>
      <div>
        <el-tooltip
          content="Guardar"
          class="item"
          effect="dark"
          placement="top"
        >
          <el-button
            type="info"
            size="mini"
            icon="el-icon-plus"
            circle
            @click="saveGeometry"
          />
        </el-tooltip>
        <el-tooltip
          content="Ver"
          class="item"
          effect="dark"
          placement="top"
        >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-view"
            circle
            @click="viewInMap"
          />
        </el-tooltip>
      </div>

    </div>
    <el-divider class="my-2" />
    <el-table
      :data="properties"
      size="mini"
    >
      <el-table-column
        label="Nombre"
        prop="key"
        width="160"
      />
      <el-table-column
        label="Descripción"
        prop="value"
      />
    </el-table>
  </el-card>

</div>
</template>

<script>
import { geoJSON } from 'leaflet'

import mountableAsDynamicMixin from "@/mixins/mountableAsDynamic.mixin"
import uploadFileMixin from '@/mixins/uploadFileMixin'
import $_use_objectToFormData from '@/use/objectToFormData'

import { mapState } from 'vuex'

export default {
  mixins: [
    mountableAsDynamicMixin, uploadFileMixin
  ],

  data: () => ({
    // defined if mountableAsDynamicMixin is included
    dynamicTitle: 'Subir Geometrias',
    dialogDynamic: {
      addView: {
        type: 'component',
        path: 'views/AddView'
      }
    },
    file: {
      type: 'shapeFile', // it's property name file inside form
      availableExtensions: ['zip',],
      selected: null,
      sendAfterUpload: true
    },
    form: {
      shapeFile: null
    },
  }),

  computed: {
    ...mapState({
      objGeoJSON: (state) => state.geometries.objGeoJSON,
    }),

    geometry: function () {
      let geometry = null
      if (this.objGeoJSON) {
        geometry = this.objGeoJSON.features[0].length ? this.objGeoJSON.features[0].geometry : null
      }
      return geometry
    },
    properties1: function () {
      return this.objGeoJSON ? this.objGeoJSON.features[0].properties : null
    },
    properties: function () {
      let result = []
      if (this.properties1) {
        result = Object.keys(this.properties1).map(key => {
          return {
            key: key,
            value: this.properties1[key]
          }
        })
      }
      return result
    },
    infoFile: function () {
      let data = {
        name: this.objGeoJSON ? this.objGeoJSON.name : '',
        typeJSON: ''
      }
      if (this.geometry)
        switch (this.geometry.type) {
        case 'Point':
          data.typeJSON = 'MARCADOR'
          break
        case 'LineString':
          data.typeJSON = 'LÍNEA'
          break
        case 'Polygon':
          data.typeJSON = 'POLÍGONO'
          break
        default:
          data.typeJSON = 'NO DEFINIDO'
          break
        }

      return data
    },
  },

  methods: {
    applyAfterUploadFile () {
      const formData = $_use_objectToFormData(this.form)
      this.$store.dispatch('geometries/getObjGeoJSON', formData)
    },
    viewInMap () {
      /* get geometry */
      const { geometry } = this.objGeoJSON.features[0]
      /* get JSON and added map*/
      geoJSON(geometry).addTo(this.$L.projectLayers)
      /* center map */
      this.$L.map.fitBounds(geoJSON(geometry).getBounds())
    },
    saveGeometry (){

    }
  },
}
</script>
