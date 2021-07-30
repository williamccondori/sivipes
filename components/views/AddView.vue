<template>
<div>
  <base-form @apply-after-submit-form="applyAfterSubmitForm">
    <!-- <el-row :gutter="10">
      <el-col :span="16"> -->
    <el-form-item
      label="Nombre de la vista"
      prop="name"
    >
      <el-input
        v-model="form.name"
        autocomplete="off"
      />
    </el-form-item>
    <!-- </el-col>
      <el-col :span="8">
        <el-form-item
          label="Zoom:"
          prop="date2"
        >
          <el-input
            v-model="form.zoom"
            autocomplete="off"
            readonly
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="Coordenadas [Latitud / Longitud]:">
      <el-col :span="11">
        <el-form-item prop="date1">
          <el-input
            v-model="form.latitude"
            autocomplete="off"
            readonly
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col
        class="line text-center"
        :span="2"
      >-</el-col>
      <el-col :span="11">
        <el-form-item prop="date2">
          <el-input
            v-model="form.longitude"
            autocomplete="off"
            readonly
            clearable
          />
        </el-form-item>
      </el-col>
    </el-form-item> -->
  </base-form>
</div>
</template>
<script>
import BaseForm from "@/components/base/BaseForm"
import mountableAsDynamicMixin from "@/mixins/mountableAsDynamic.mixin"
import { required } from "@/config/form.rules"

export default {
  components: {
    BaseForm
  },
  mixins: [mountableAsDynamicMixin],
  data () {
    return {
      dynamicTitle: 'Crear Vista',
      form: {
        name: '',
        zoom: '',
        latitude: '',
        longitude: ''
      },
      rules: {
        name: required('el', 'nombre')
      },
      submit: {
        storeName: 'views',
        storeAction: 'create',
      }
    }
  },
  mounted () {
    const LMap = this.$L.map
    let mapCenter = LMap.getCenter()
    this.form.latitude = mapCenter.lat
    this.form.longitude = mapCenter.lng
    this.form.zoom = LMap.getZoom()
  },
  methods: {
    applyAfterSubmitForm () {
      this.$store.dispatch('views/getDataContext')
      this.$_mountableAsDynamic_closeDialog()
    }
  },

}
</script>
