<template>
<base-form @apply-after-submit-form="applyAfterSubmitForm">
  <el-form-item
    label="Nombre"
    prop="name"
  >
    <el-input
      ref="input"
      v-model="form.name"
      placeholder="nombre del polígono"
      auto-complete="off"
      clearable
    />
  </el-form-item>
</base-form>
</template>

<script>
import BaseForm from "@/components/base/BaseForm"

import mountableAsDynamicMixin from '@/mixins/mountableAsDynamic.mixin'

import { required } from "@/config/form.rules"
import { SERVICES } from '@/services/services.types'

export default {
  components: {
    BaseForm
  },

  mixins: [mountableAsDynamicMixin],

  props: {
    properties: {
      type: Object, default: () => ({})
    }
  },

  data: () => ({
    // defined if mountableAsDynamicMixin is included
    dynamicTitle: 'Registrar Polígono',

    form: {
      name: '',
      geometry: '',
      description: ''
    },
    rules: {
      name: required('el', 'nombre')
    },
    submit: {
      storeName: 'polygons',
      storeAction: 'create',
      notifyType: 'CREATED'
    }
  }),

  mounted () {
    this.setGeometryAsGeoJSON()
    // set focus on input
    this.$refs.input.$el.children[0].focus()
  },

  methods: {
    setGeometryAsGeoJSON () {
      this.form.geometry = JSON.stringify(this.properties.toGeoJSON())
    },

    /**
     * removing polygon from tempLayers
     * closing dialog
     * getting polygons everytime a polygon is created
     * updating visible polygons buttons
     */
    async applyAfterSubmitForm () {
      this.$L.tempLayers.removeLayer(this.properties)
      this.$_mountableAsDynamic_closeDialog()
      try {
        await this.$_leafLet_service(SERVICES.LEAFLET.FETCH_PROJECT_LAYERS, this.$L.projectLayers)
      } catch (error) {
      }
    }
  }
}
</script>
