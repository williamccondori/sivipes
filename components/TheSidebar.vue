<template>
<el-tabs
  type="border-card"
  class="the-sidebar"
>

  <el-tab-pane>
    <span
      slot="label"
      class="text-center"
    ><i class="el-icon-menu" /> MENU</span>

    <panel-control @select-component-dynamic="openDrawerDynamic" />

  </el-tab-pane>

  <drawer-dynamic
    ref="drawerDynamic"
    :component="selectedComponent"
    :drawer-direction="selectedComponent.directionDrawer"
    :drawer-size="selectedComponent.widthDrawer"
  />

</el-tabs>
</template>

<script>
import PanelControl  from '@/components/panels/PanelControl'

import DrawerDynamic from "@/components/drawer/DrawerDynamic"

/**
 * TODO: COLLAPSED MODE
 */
export default {
  components: {
    PanelControl,
    DrawerDynamic
  },

  data () {
    return {
      // sidebar
      isCollapse: false,
      // dynamic component
      selectedComponent: {
        type: 'component',
        path: 'fallback/Fallback'
      }
    }
  },

  methods: {
    /**
     ** setting as selectedComponent from sidebar selected item control panel
     */
    openDrawerDynamic (component) {
      this.selectedComponent = component
      this.$refs.drawerDynamic.setDrawerVisible()
    }
  }
}
</script>
