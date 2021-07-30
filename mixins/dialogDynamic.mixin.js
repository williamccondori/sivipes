import DialogDynamic from '@/components/dialog/DialogDynamic'

export default {
  components: {
    DialogDynamic
  },

  data: () => ({
    dialogDynamicMixin_componentSelected: {}
  }),

  methods: {
    /**
     * setting dialogDynamic selected on dialog-dynamic component
     *
     * @param {Object} componentName
     */
    $_dialogDynamicMixin_dialogOpen (componentName) {
      this.dialogDynamicMixin_componentSelected = componentName
      this.$refs.dialogDynamic.setDialogVisible()
    },

    /**
     * setting fallback component when dialog is closed
     */
    $_dialogDynamicMixin_dialogClose () {
      this.dialogDynamicMixin_componentSelected = {
        type: 'component',
        path: 'fallback/Fallback'
      }
    }
  }
}
