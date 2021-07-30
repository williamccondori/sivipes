<template>
<div>
  <base-form @apply-after-submit-form="applyAfterSubmitForm">
    <el-form-item
      label="Nombre del proyecto"
      prop="name"
    >
      <el-input
        v-model="form.name"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item
      label="Descripción"
      prop="description"
    >
      <el-input
        v-model="form.description"
        type="textarea"
      />
    </el-form-item>
  </base-form>
</div>
</template>
<script>
import BaseForm from "@/components/base/BaseForm"
import mountableAsDynamicMixin from "@/mixins/mountableAsDynamic.mixin"
import { required } from "@/config/form.rules"
import { mapState } from 'vuex'

export default {
  components: {
    BaseForm
  },
  mixins: [mountableAsDynamicMixin],
  data () {
    return {
      dynamicTitle: 'Editar proyecto',
      form: {
        id:'',
        name: '',
        description: ''
      },
      rules: {
        name: required('el', 'nombre'),
        description: required('la', 'descripción')
      },
      submit: {
        storeName: 'projects',
        storeAction: 'update',
      }
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.projects.itemContext
    })
  },
  mounted () {
    this.form.id = this.project.id
    this.form.name = this.project.name
    this.form.description = this.project.description
  },
  methods: {
    applyAfterSubmitForm () {
      this.$store.dispatch('projects/getDataContext')
    }
  },

}
</script>
