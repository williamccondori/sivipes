<template>
<el-drawer
  ref="drawer"
  :title="title"
  :visible.sync="visible"
  append-to-body
  :direction="drawerDirection"
  :size="drawerSize"
  :modal="false"
  custom-class="drawer-right"
>
  <div class="ma-2">
    <keep-alive>
      <component
        :is="dynamicComponent"
        @set-dynamic-title="setDynamicTitle"
      />
    </keep-alive>
  </div>

</el-drawer>
</template>

<script>
import WrapperDynamicSetup from '@/components/base/setup/WrapperDynamicSetup'

export default {
  extends: WrapperDynamicSetup, // parent logic

  props: {
    drawerSize: { type: String, default: '33%' },
    drawerDirection: { type: String, default: 'ltr' },
  },

  mounted () {

    // prevent tabindex on title when drawer is visible
    this.$refs.drawer.$el.firstChild.querySelector('span').removeAttribute('tabindex')
  }
}
</script>
