<template>
<el-form
  ref="form"
  :model="$parent.form"
  :rules="$parent.rules"
  :disabled="$store.state.spinners.PROCESSING_FORM"
  label-position="top"
  label-width="120px"
>
  <slot />

  <div class="form-btn-actions">
    <!-- default actions -->
    <template v-if="!customActions">
      <el-button
        v-if="$parent.mountedAsDynamic"
        size="small"
        @click="$parent.$_mountableAsDynamic_closeDialog"
      >
        CERRAR
      </el-button>
      <el-button
        type="success"
        size="small"
        native-type="submit"
        :loading="$store.state.spinners.PROCESSING_FORM"
        @click.prevent="submitForm"
      >
        GUARDAR
      </el-button>
    </template>

    <!-- custom actions -->
    <slot
      v-else
      :submit-form="submitForm"
      name="custom-actions"
    />

  </div>
</el-form>
</template>

<script>
import $_use_objectToFormData from '@/use/objectToFormData'

import {
  $_notify_success,
  $_notify_error
} from '@/use/notifications'

import {
  SUCCESS,
  ERRORS
} from '@/config/messages'

import { SPINNERS } from '@/store/mutations.types'

export default {
  props: {
    customActions: {
      type: Boolean, default: false
    }
  },

  methods: {
    async submitForm () {
      let isFormValid = false

      await this.$refs.form.validate(result => isFormValid = result)

      if (isFormValid) {
        const formData = $_use_objectToFormData(this.$parent.form)

        // parent submit context
        const { storeAction, notifyType } = this.$parent.submit

        // used when need to apply custom functionality/fix on formData before to be sends
        this.$emit('apply-before-submit-form', formData)

        try {
          await this.$_request_service(this.submitAction(formData), SPINNERS.PROCESSING_FORM)

          $_notify_success(SUCCESS[notifyType])

          if (storeAction === 'create' || storeAction === 'update') this.resetForm()

          this.$emit('apply-after-submit-form')

        } catch (error) {}

      } else {
        $_notify_error(ERRORS.INVALID_DATA)
      }
    },

    async submitAction (formData) {
      const { storeName, storeAction } = this.$parent.submit

      await this.$store.dispatch(`${storeName}/${storeAction}`, formData)
    },

    clearValidate () {
      this.$refs.form.clearValidate()
    },

    resetForm () {
      this.$refs.form.resetFields()
    }
  }
}
</script>
