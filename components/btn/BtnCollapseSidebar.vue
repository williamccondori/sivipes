<template>
<el-button
  ref="btnCollapseSidebar"
  class="btn-collapse-sidebar pl-0"
  type="primary"
  icon="el-icon-s-fold"
  squared
  @click="spinIconCollapseSidebar"
/>
</template>

<script>
import { sidebarWidth } from '@/assets/sass/_variables.scss'

export default {
  data () {
    return {
      btnCollapseSidebar: null,
      elAside: null
    }
  },
  mounted () {
    // getting <el-aside> component element
    this.elAside = document.querySelector('.el-aside')
    // getting <btnCollapseSidebar> component element
    this.btnCollapseSidebar = this.$refs.btnCollapseSidebar.$el
  },

  methods: {
    /**
     ** spin icon toggleable on navbar to collapse the sidebar
     ** resizing width of <el-aside> component on layout default
     */
    spinIconCollapseSidebar () {
      if (this.elAside.classList.contains('collapsed')) {
        this.btnCollapseSidebar.style.webkitTransform = 'rotate(0deg)'
        this.elAside.style.width = sidebarWidth
      } else {
        this.btnCollapseSidebar.style.webkitTransform = 'rotate(180deg)'
        this.elAside.style.width = '0px'
      }
      this.elAside.classList.toggle('collapsed')
    }
  }
}
</script>
