import UploadFile from '@/components/base/UploadFile'

export default {
  components: {
    UploadFile
  },

  methods: {
    /**
     * clear file from form
     *
     */
    $_uploadFileMixin_clear () {
      this.form[this.file.type] = null
      this.file.selected = null
      this.form.name = ''
      this.form.title = ''
    },

    /**
     * setting file to form
     * autocomplete name field on form depending of file name
     *
     * @param {File} file
     */
    $_uploadFileMixin_valid (file) {
      this.form[this.file.type] = file
      this.file.selected = file
      const nameFile = file.name.split('.')[0]
      this.form.name = nameFile
      this.form.title = nameFile

      if(this.file.sendAfterUpload) {
        //use the function en methods in component father
        this.applyAfterUploadFile(file)
      }
    }
  }
}
