<script>
export default {
  props: {
    component: {
      type: Object,
      default: () => ({
        type: 'component',
        path: 'fallback/Fallback'
      })
    }
  },

  data: () => ({
    visible: false,
    title: ''
  }),

  computed: {
    dynamicComponent () {
      return this.component.type === 'page'
        ? () => import('@/pages/' + this.component.path)
        : () => import('@/components/' + this.component.path)
    }
  },

  methods: {
    dialogClose () {
      this.$emit('dialog-close')
    },

    /**
     * setting from child dynamic component
     */
    setDynamicTitle (titleFromDynamicChild) {
      this.title = titleFromDynamicChild
    },

    /**
     * properties to dynamic child component
     */
    $setPropertiesToChild (properties) {
      this.properties = properties
    },

    setDialogVisible () {
      this.visible = true
    },

    setDrawerVisible () {
      this.visible = true
    },

    setDialogNotVisible () {
      this.visible = false
    }
  }
}
</script>
