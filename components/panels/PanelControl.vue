<template>
<el-menu
  :background-color="sidebarBgColor"
  :collapse="isCollapse"
  @select="handleSelectedItem"
>
  <el-menu-item
    v-for="(item, index) in items" :key="index"
    :index="item.title"
  >
    <i :class="item.icon" />
    <span slot="title">{{ item.title }}</span>
  </el-menu-item>
</el-menu>
</template>

<script>
import {
  sidebarBgColor,
  sidebarActiveTextColor
} from '@/assets/sass/_variables.scss'

export default {
  data: () => ({
    // scss variables
    sidebarBgColor,
    sidebarActiveTextColor,
    //sidebar
    isCollapse: false,
    // menu items
    items: [
      {
        title: 'Catálogo de Imágenes', icon: 'el-icon-collection',
        component: {
          type: 'component',
          path:'panels/control/Catalogue'
        }
      },
      {
        title: 'Áreas - Polígonos', icon: 'el-icon-news',
        component: {
          type: 'component',
          path:'panels/control/Polygons'
        }
      },
      {
        title: 'Deteccion', icon: 'el-icon-files',
        component: {
          type: 'component',
          path:'panels/control/Deteccion'
        }
      },
    ]
  }),

  methods: {
    /**
     * emit to parent the current selected component
     * to be displayed on WrapperDynamic component
     */
    handleSelectedItem (key) {
      this.$emit('select-component-dynamic', this.items.find(item => item.title === key).component)
    }
  }
}
</script>
