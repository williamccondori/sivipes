<template>
<base-form
  ref="baseForm"
  custom-actions
  @apply-before-submit-form="applyBeforeSubmitForm"
  @apply-after-submit-form="applyAfterSubmitForm"
>
  <el-form-item
    label="Seleccione la Imagen Completa"
    prop="image_id"
  >
    <el-input
      ref="input"
      v-model="image_name"
      placeholder="identificador de imagen"
      auto-complete="off"
      :disabled="true"
      clearable
      @input="$refs.baseForm.clearValidate()"
    />
  </el-form-item>

  <el-collapse
    ref="collapse"
    accordion @change="onChangeCollapse"
  >
    <el-collapse-item name="advancedSearch">
      <template slot="title">
        <i class="header-icon el-icon-s-tools mx-2" />Puede especificar el área de interes
      </template>

      <el-divider content-position="left">Area . Poligono</el-divider>
      <el-form-item
        prop="area"
        class="px-2 pb-2"
      >
        <el-select
          v-model="form.area"
          class="full-width"
          placeholder="Elija un polígono"
          filterable
          aauto-complete="off"
        >
          <el-option
            v-for="(polygon, index) in polygons"
            :key="index"
            :label="polygon.name"
            :value="polygon.id"
          />
        </el-select>
      </el-form-item>
    </el-collapse-item>
  </el-collapse>

  <template v-slot:custom-actions="{}">
    <el-button
      :loading="$store.state.spinners.PROCESSING_FORM"
      icon="el-icon-search"
      type="success"
      class="full-width"
      @click="get_data"
    >
      <b>DETECTAR</b>
    </el-button>
    <el-button
      :loading="$store.state.spinners.PROCESSING_FORM"
      icon="el-icon"
      type="danger"
      class="full-width"
      @click="remove_data"
    >
      <b>LIMPIAR</b>
    </el-button>
  </template>
</base-form>
</template>

<script>
import BaseForm from '@/components/base/BaseForm'

import { geoJSON, layerGroup } from 'leaflet'

import { SERVICES } from '@/services/services.types'
import { SET_SATELITAL_IMAGES_FILTERED } from '@/store/mutations.types'
import { Loading } from 'element-ui'

import axios from 'axios'

export default {
  components: {
    BaseForm
  },

  data () {
    return {
      layerGroup: null,
      form: {
        image_id: '',
        start_date: '',
        end_date: '',
        cloud_cover: 0,
        area: ''
      },
      rules: {
        area: [
          {
            // eslint-disable-next-line no-unused-vars
            validator: (rule, value, callback) => {
              if (this.form.image_id === '' && this.form.area === '') {
                callback(
                  new Error(
                    'El polígono es requerido cuando no se especifica el identificador de imagen'
                  )
                )
                if (this.accordionHandler.collapse) this.toggleAccordion()
              }
              callback()
            }
          }
        ]
      },
      submit: {
        storeName: 'satelitalImages',
        storeAction: 'search',
        notifyType: 'SEARCHED'
      },

      accordionHandler: {
        el: null,
        collapse: true
      },
      // form helpers
      date: []
    }
  },

  computed: {
    polygons () {
      return this.$store.state.polygons.dataContext
    },
    image_name () {
      return this.$store.state.common.image.name
    }
  },

  watch: {
    date (val) {
      this.form.start_date = val[0]
      this.form.end_date = val[1]
    }
  },

  created () {
    this.init()
  },

  mounted () {
    if (layerGroup) {
      this.layerGroup = layerGroup()
      this.$L.map.addLayer(this.layerGroup)
    }
    // set focus on input
    this.$refs.input.$el.children[0].focus()
    // accordionHandler collapse mode
    this.accordionHandler.el = this.$refs.collapse.$el.querySelector('.el-collapse-item__header')
  },

  methods: {
    remove_data () {
      this.layerGroup.clearLayers()
    },
    get_data () {
      this.layerGroup.clearLayers()
      const token = this.$auth.getToken('local')
      let loadingInstance = Loading.service({ fullscreen: true })
      axios
        .post(
          'http://190.119.178.178:3332/api/detector/',
          { identificator: this.image_name, polygonId: this.form.area ? this.form.area : 0 },
          { headers: { Authorization: `${token}` } }
        )
        .then(response => {
          response.data.forEach(gjson => {
            let properties = gjson.properties
            let color = properties.ilegal ? '#FF0000':'#00FF00'
            let geoJsonLayer = geoJSON(gjson,{
              style: {'color': color }
            })
            let ilegal = properties.ilegal ? "NO" : "SI"

            if (properties) {
              let htmlData = ''
              htmlData += `<tr><th>Clase</th><td>${properties['classSpanish']}</td></tr>`
              htmlData += `<tr><th>Tipo de embarcación</th><td>${properties['type']}</td></tr>`
              htmlData += `<tr><th>Puntaje de detección</th><td>${(properties['detectionScore']).toFixed(2)}</td></tr>`
              htmlData += `<tr><th>Eslora</th><td>${(properties['eslora']).toFixed(2)}</td></tr>`
              htmlData += `<tr><th>Manga</th><td>${(properties['manga']).toFixed(2)}</td></tr>`
              htmlData += `<tr><th>Capacidad de bodega</th><td>0</td></tr>`
              htmlData += `<tr><th>Puntaje de clasificación</th><td>${(properties['classificationScore']).toFixed(2)}</td></tr>`
              htmlData += `<tr><th>Permitido</th><td><b style="color:${color}" >${ilegal}</b></td></tr>`

              let htmlTable = `<table class="table-uper table table-sm table-striped table-hover table-bordered">${htmlData}</table>`
              geoJsonLayer.bindPopup(htmlTable)
              console.log(htmlTable)
              //this.$L.map.fitBounds(geoJsonLayer.getBounds())
            }
            this.layerGroup.addLayer(geoJsonLayer)
          })
          loadingInstance.close()
        }).catch(error => {
          console.log(error)
          loadingInstance.close()
        })
    },
    async init () {
      try {
        await this.$_leafLet_service(SERVICES.LEAFLET.FETCH_PROJECT_LAYERS, this.$L.projectLayers)
      } catch {}
    },

    applyBeforeSubmitForm (formData) {
      if (this.form.cloud_cover === 0) formData.delete('cloud_cover')

      if (this.form.area !== '') {
        const geoJsonGenerated = geoJSON(JSON.parse(formData.get('area'))).toGeoJSON().features[0]

        formData.set('area', JSON.stringify(geoJsonGenerated))
      }

      this.$store.commit(`satelitalImages/${SET_SATELITAL_IMAGES_FILTERED}`, [])
      this.$L.WMSSatelitalLayers.clearLayers()
    },

    applyAfterSubmitForm () {
      if (!this.accordionHandler.collapse) {
        this.toggleAccordion()
        // reseting form
        this.$refs.baseForm.resetForm()
        this.date = [
          '', ''
        ]
      }
    },
    get_info () {
      if (!this.accordionHandler.collapse) {
        this.toggleAccordion()
        // reseting form
        this.$refs.baseForm.resetForm()
        this.date = [
          '', ''
        ]
      }
    },

    onChangeCollapse (val) {
      this.accordionHandler.collapse = !(val === 'advancedSearch')
    },

    toggleAccordion () {
      this.accordionHandler.el.click()
    }
  }
}
</script>
