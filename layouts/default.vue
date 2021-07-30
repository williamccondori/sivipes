<template>
<el-container ref="elContainer">

  <el-header
    :height="navbarHeight" class="px-0"
  >
    <the-navbar />
  </el-header>

  <el-container>

    <el-aside :width="sidebarWidth">
      <the-sidebar />
    </el-aside>

    <el-container>

      <el-main class="pa-0">

        <nuxt />

      </el-main>

    </el-container>
    <el-aside
      width="0px"
      class="el-aside-right"
    >
      <the-sidebar-right />
    </el-aside>
  </el-container>

</el-container>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import TheSidebar from '@/components/TheSidebar'
import TheSidebarRight from '@/components/TheSidebarRight'

import {
  navbarHeight,
  sidebarWidth
} from '@/assets/sass/_variables.scss'

export default {
  components: {
    TheNavbar,
    TheSidebar,
    TheSidebarRight
  },

  data: () => ({
    // scss variables
    navbarHeight,
    sidebarWidth
  })
}
</script>
