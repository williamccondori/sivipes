<template>
<el-container ref="elContainer">

  <el-header
    :height="navbarHeight" class="px-0"
  >
    <the-navbar />
  </el-header>

  <el-container>

    <el-aside :width="sidebarWidth">
      <the-sidebar-default />
    </el-aside>

    <el-container>

      <el-main>

        <nuxt />

      </el-main>

    </el-container>

  </el-container>

</el-container>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import TheSidebarDefault from '@/components/TheSidebarDefault'

import {
  navbarHeight,
  sidebarWidth
} from '@/assets/sass/_variables.scss'

export default {
  components: {
    TheNavbar,
    TheSidebarDefault
  },

  data: () => ({
    // scss variables
    navbarHeight,
    sidebarWidth
  })
}
</script>
