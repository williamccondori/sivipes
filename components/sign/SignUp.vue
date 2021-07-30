<template>
<el-form
  ref="form"
  :model="form"
  :rules="rules"
  @submit.native.prevent="signUp"
>
  <el-form-item prop="username">
    <el-input
      v-model="form.username"
      placeholder="Usuario"
      prefix-icon="el-icon-user"
      autocomplete="off"
    />
  </el-form-item>
  <el-form-item prop="password">
    <el-input
      v-model="form.password"
      placeholder="Contraseña"
      prefix-icon="el-icon-lock"
      type="password"
      autocomplete="off"
    />
  </el-form-item>
  <el-form-item>
    <el-button
      :loading="$store.state.spinners.processingForm"
      class="sign-in__form__btn"
      type="primary"
      native-type="submit"
    >
      Registrar
    </el-button>
  </el-form-item>
</el-form>
</template>

<script>
import { required } from '@/config/form.rules'

import mountableAsDynamicMixin from "@/mixins/mountableAsDynamic.mixin"

export default {
  mixins: [mountableAsDynamicMixin],

  data () {
    return {
      // defined if mountableAsDynamicMixin is included
      dynamicTitle: 'Registro de usuario #TODO FORM',

      form: {
        username: '',
        password: ''
      },
      rules: {
        username: required('el', 'usuario'),
        password: required('la', 'contraseña')
      }
    }
  },

  methods: {
    signUp () {
      console.warn('signUp')
    }
  }
}
</script>
