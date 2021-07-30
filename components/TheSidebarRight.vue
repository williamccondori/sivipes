<template>
<div>
  <ul class="list-group pa-0 ma-0">
    <li class="user-info">
      <img
        src="/images/satelite.jpg"
        alt="user" class="h-100 w-100"
      >
      <div class="content">
        <small class="font-weight-bold">Sistema de Vigilancia y Control Pesquero <br> SIVIPES v0.1 (Alpha)</small> <br>
      </div>
    </li>
  </ul>
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
</div>
</template>

<script>
import {
  sidebarBgColor,
  sidebarActiveTextColor
} from '@/assets/sass/_variables.scss'
import { SERVICES } from '@/services/services.types'

/**
 * TODO: COLLAPSED MODE
 */
export default {
  components: {
    // PanelControl,
    // PanelImages,
    // DrawerDynamic
  },

  data () {
    return {
      // sidebar
      isCollapse: false,
      sidebarBgColor,
      sidebarActiveTextColor,
      // dynamic component
      selectedComponent: {
        type: 'component',
        path: 'fallback/Fallback'
      },

      items: [
        {
          id:1,
          title: 'Proyectos', icon: 'el-icon-s-grid',
          component: {
            type: '',
            path:''
          }
        },
        {
          id:4,
          title: 'Manual de usuario', icon: 'el-icon-notebook-2',
          component: {
            type: '',
            path:''
          }
        },
        {
          id:7,
          title: 'Cerrar Sesión', icon: 'el-icon-unlock',
          component: {
            type: '',
            path:''
          }
        },
      ]
    }
  },

  methods: {
    /**
     ** setting as selectedComponent from sidebar selected item control panel
     */
    openDrawerDynamic (component) {
      this.selectedComponent = component
      this.$refs.drawerDynamic.setDrawerVisible()
    },
    handleSelectedItem (key) {
      let menu =  this.items.find(item => item.title === key)
      switch (menu.id) {
      case 1:
        this.$router.push('/')
        break
      case 7:
        this.$_auth_service(SERVICES.AUTH.SIGN_OUT)
        break

      default:
        break
      }
    }
  }
}
</script>
