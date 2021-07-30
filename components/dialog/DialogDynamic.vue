<template>
<el-dialog
  :title="title"
  :visible.sync="visible"
  :close-on-click-modal="false"
  append-to-body
  destroy-on-close
  top="2vh"
  class="dialog-responsive"
  @close="dialogClose"
>

  <component
    :is="dynamicComponent"
    :properties="properties"
    @set-dynamic-title="setDynamicTitle"
    @dialog-close="visible = false"
  />

</el-dialog>
</template>

<script>
import WrapperDynamicSetup from '@/components/base/setup/WrapperDynamicSetup'

export default {
  extends: WrapperDynamicSetup, // parent logic

  data: () => ({
    properties: {}
  }),

  methods: {
    dialogClose () {
      this.$emit('dialog-close')
    }
  }
}
</script>
