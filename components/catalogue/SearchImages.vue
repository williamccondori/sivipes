<template>
<base-form
  ref="baseForm"
  custom-actions
  @apply-before-submit-form="applyBeforeSubmitForm"
  @apply-after-submit-form="applyAfterSubmitForm"
>
  <el-form-item
    label="Identificador de imagen"
    prop="image_id"
  >
    <el-input
      ref="input"
      v-model="form.image_id"
      placeholder="identificador de imagen"
      auto-complete="off"
      clearable
      @input="$refs.baseForm.clearValidate()"
    />
  </el-form-item>

  <el-collapse
    ref="collapse"
    accordion
    @change="onChangeCollapse"
  >
    <el-collapse-item name="advancedSearch">
      <template slot="title">
        <i class="header-icon el-icon-s-tools mx-2" />Busqueda avanzada
      </template>

      <el-divider content-position="left">Polígono</el-divider>
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
            v-for="(polygon, index) in polygons" :key="index"
            :label="polygon.name"
            :value="polygon.geometry"
          />
        </el-select>
      </el-form-item>

      <el-divider content-position="left">Rango de fechas</el-divider>
      <div class="px-2">
        <el-date-picker
          v-model="date"
          style="width:100%"
          type="daterange"
          align="center"
          start-placeholder="Fecha inicial"
          end-placeholder="Fecha final"
          format="yyyy/MM/dd"
          value-format="yyyy-MM-dd"
          default-value="2020-01-01"
          size="large"
          auto-complete="off"
        />
      </div>

      <el-divider content-position="left">Rango de cobertura de nubes</el-divider>
      <el-form-item
        prop="cloud_cover"
        class="px-2"
      >
        <el-slider
          v-model="form.cloud_cover"
          show-input
          :min="0"
          :max="100"
          :step=".5"
          input-size="large"
          class="pl-4"
          :format-tooltip="(val) => `${val}%`"
        />
      </el-form-item>
    </el-collapse-item>
  </el-collapse>

  <template
    v-slot:custom-actions="{
      submitForm
    }"
  >
    <el-button
      :loading="$store.state.spinners.PROCESSING_FORM"
      icon="el-icon-search"
      type="success"
      class="full-width"
      @click="submitForm"
    >
      BUSCAR
    </el-button>

  </template>

</base-form>
</template>

<script>
import BaseForm from '@/components/base/BaseForm'

import { geoJson } from 'leaflet'

import { SERVICES } from '@/services/services.types'
import { SET_SATELITAL_IMAGES_FILTERED } from '@/store/mutations.types'

export default {
  components: {
    BaseForm
  },

  data () {
    return {
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
                callback(new Error('El polígono es requerido cuando no se especifica el identificador de imagen'))
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
    satelitalsImages () {
      return this.$store.state.satelitalsImages.dataContext
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
    // set focus on input
    this.$refs.input.$el.children[0].focus()
    // accordionHandler collapse mode
    this.accordionHandler.el = this.$refs.collapse.$el.querySelector('.el-collapse-item__header')
  },

  methods: {
    async init () {
      try {
        await this.$_leafLet_service(SERVICES.LEAFLET.FETCH_PROJECT_LAYERS, this.$L.projectLayers)
      } catch {
      }
    },

    applyBeforeSubmitForm (formData) {
      if (this.form.cloud_cover === 0) formData.delete('cloud_cover')

      if (this.form.area !== '') {
        const geoJsonGenerated = geoJson(JSON.parse(formData.get('area'))).toGeoJSON().features[0]

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

    onChangeCollapse (val) {
      this.accordionHandler.collapse = !(val === 'advancedSearch')
    },

    toggleAccordion () {
      this.accordionHandler.el.click()
    }
  },
}
</script>
