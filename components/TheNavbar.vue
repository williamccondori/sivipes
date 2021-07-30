<template>
<nav class="the-navbar">
  <el-menu
    mode="horizontal"
    :background-color="navbarBgColor"
    :text-color="navbarTextColor"
    :active-text-color="navbarTextColor"
    class="the-navbar__menu"
    @select="selectMenuItem"
  >
    <div class="the-navbar__menu-items">
      <div class="the-navbar__menu-items--left">
        <btn-collapse-sidebar />
        <el-menu-item index="home">
          <span class="the-navbar__menu-items--text">Sistema de Vigilancia y Control Pesquero</span>
        </el-menu-item>
      </div>

      <div class="the-navbar__menu-items--right">
        <el-menu-item
          index="user"
          @click="openSidebarRight"
        >
          <template slot="title">
            <div class="pr-5">
              <el-avatar
                size="small"
                src="/images/user_icon.png"
              />
              {{ $auth.user? $auth.user.username : '' }}
            </div>
          </template>
        </el-menu-item>
      </div>
    </div>
  </el-menu>
</nav>
</template>

<script>
import BtnCollapseSidebar from '@/components/btn/BtnCollapseSidebar'
import { sidebarWidth } from '@/assets/sass/_variables.scss'

import { navbarBgColor, navbarTextColor } from '@/assets/sass/_variables.scss'
import { SERVICES } from '@/services/services.types'

export default {
  components: {
    BtnCollapseSidebar
  },

  data () {
    return {
      // scss variables
      navbarBgColor,
      navbarTextColor,
      elAsideRight: null
    }
  },
  mounted () {
    this.elAsideRight = document.querySelector('.el-aside-right')
    console.log(this.elAsideRight, 'el')
  },

  methods: {
    selectMenuItem (key) {
      if (key === 'logout') {
        this.$_auth_service(SERVICES.AUTH.SIGN_OUT)
      }
    },
    openSidebarRight () {
      if (!this.elAsideRight) return false
      if (this.elAsideRight.classList.contains('collapsed')) {
        this.elAsideRight.style.width = '0px'
      } else {
        this.elAsideRight.style.width = sidebarWidth
      }
      this.elAsideRight.classList.toggle('collapsed')
    }
  }
}
</script>

<style scoped>
.user-info .el-avatar {
  border-radius: 3px !important;
}
.user-info span {
  margin-top: 0px;
  margin-right: 5px !important;
}
</style>
