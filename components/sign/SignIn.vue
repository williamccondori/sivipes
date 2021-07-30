<template>
<div class="sign-in">
  <el-card class="sign-in__form">
    <div class="login-header">
      <img
        src="~/static/icons/mar.svg"
        alt="logo"
      >
      <h1>Sistema de Vigilancia y Control Pesquero</h1>
      <h2>SIVIPES v0.1 (Alpha)</h2>
    </div>
    <el-form
      ref="form"
      :disabled="$store.state.spinners.PROCESSING_FORM"
      :model="form"
      :rules="rules"
      @submit.native.prevent="signIn"
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
          :loading="$store.state.spinners.PROCESSING_FORM"
          class="sign-in__form__btn"
          type="primary"
          native-type="submit"
        >
          Iniciar Sesión
        </el-button>
      </el-form-item>
      <el-form-item>
        <slot name="second-button" />
      </el-form-item>
    </el-form>
  </el-card>
  <div class="footer">
    PROYECTO IBA 0032-2017 - UNSA
  </div>
</div>
</template>

<script>
import { $_notify_error } from '@/use/notifications'

import { ERRORS } from '@/config/messages'

import { required } from '@/config/form.rules'
import { SERVICES } from '@/services/services.types'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: required('El', 'usuario'),
        password: required('La', 'contraseña')
      }
    }
  },

  methods: {
    async signIn () {
      let isFormValid = false

      await this.$refs.form.validate(result => (isFormValid = result))

      if (isFormValid) this.$_auth_service(SERVICES.AUTH.SIGN_IN, this.form)
      else $_notify_error(ERRORS.INVALID_DATA)
    }
  }
}
</script>

<style lang="sass">
.login-header
  margin: 20px 0
  text-align: center
  img
    width: 6em
  h1
    font-weight: bold
    color: #005898
  h2
    font-weight: bold
    font-size: .8rem
    color: #005898
</style>