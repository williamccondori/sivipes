<template>
<div>
  <el-upload
    ref="uploadFile"
    class="upload-demo"
    :class="{ 'mb-35' : !file.selected }"
    :disabled="$store.state.spinners.processingForm"
    :http-request="onFileValid"
    :show-file-list="false"
    :before-upload="beforeFileUpload"
    drag
    action
  >

    <img
      v-if="file.imageUrl"
      :class="[
        {},
        [
          avatarImage ? 'avatar' : typeImage ? 'image-input' : 'archive-input'
        ]
      ]"
      :src="file.imageUrl"
    >

    <template v-else>
      <div
        class="px-2"
        :class="avatarImage ? 'avatar' : 'archive-input'"
      >
        <i
          class="avatar-uploader-icon my-0"
          :class="typeImage ? 'el-icon-picture' : 'el-icon-upload'"
        />
        <div class="el-upload__text">
          <div class="px-2">Suelta él archivo <br>
            <strong>{{ extensionsString }}</strong>
            <br> ó <br>
            <em>haz click para cargar</em>
          </div>
        </div>
      </div>
    </template>
  </el-upload>
  <ul
    v-if="file.selected"
    class="el-upload-list el-upload-list--text px-3"
  >
    <li
      tabindex="0"
      class="el-upload-list__item is-success"
    >
      <a class="el-upload-list__item-name">
        <i class="el-icon-document" />
        {{ file.selected.name }}
      </a>
      <label class="el-upload-list__item-status-label">
        <i class="el-icon-upload-success el-icon-circle-check" />
      </label>
      <el-tooltip
        class="item"
        effect="dark"
        content="Eliminar archivo"
        placement="top"
      >
        <i
          class="el-icon-close"
          @click="deleteFile()"
        />
      </el-tooltip>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      default: () => ({
        availableExtensions: { type: Array, required: true },
        selected: { type: File, default: () => { } },
        imageUrl: { type: String, required: false },
        maxSizeLength: { type: Number, required: false },
        maxSizeLabel: { type: String, required: false },
      })
    },
    typeImage: { type: Boolean, default: false },
    avatarImage: { type: Boolean, default: false },
    applyAfterAction: { type: Boolean, default: false }
  },

  data () {
    return {
      extensionsString: '',
      zipImageFallback: '/images/zip.jpg',
      excelImageFallback: '/images/excel.png',
    }
  },

  watch: {
    // reset file & img preview
    'file.selected' (newValue) {
      if (!newValue) {
        this.file.imageUrl = ''
        this.file.selected = null
      }
    }
  },

  mounted () {
    this.assignExtensionsString()
  },

  methods: {
    onFileValid ({ file }) {
      if (this.typeImage) this.file.imageUrl = URL.createObjectURL(file)
      this.$emit('on-file-valid', file)
    },

    beforeFileUpload (currentFile) {
      const currentExtension = `${currentFile.name.split('.').pop()}`

      const isExtensionValid = this.file.availableExtensions.includes(currentExtension) // || currentFile.type === 'application/zip'

      if (!isExtensionValid) {
        this.$message.error(`Solo se acepta archivos ${this.extensionsString}`)
        return isExtensionValid
      }

      if (this.file.maxSizeLength) {
        const currentImageSize = currentFile.size

        const isImageSizeValid = currentImageSize < this.file.maxSizeLength

        if (!isImageSizeValid) {
          this.$message.error(`El archivo no debe exceder los ${this.file.maxSizeLabel}!`)
          return isImageSizeValid
        }
      }

      // #TODO: callback for current extension fallback image
      // assign preview zip image fallback when have zip extension
      if (currentExtension === 'zip') this.file.imageUrl = this.zipImageFallback
      // eslint-disable-next-line array-element-newline, array-bracket-newline
      if (['xls', 'xlsx'].includes(currentExtension)) this.file.imageUrl = this.excelImageFallback

      return true
    },

    assignExtensionsString () {
      this.file.availableExtensions.forEach(e => {
        this.extensionsString += e + ', '
      })
      this.extensionsString = '(' + this.extensionsString.substring(0, this.extensionsString.length - 2) + ')'
    },

    /**
     * only can clean file if proccessingForm is false
     *
     */
    deleteFile () {
      if (!this.$store.state.spinners.processingForm) {
        this.file.imageUrl = ''
        this.$emit('delete-file')
      }
    }
  }
}
</script>

<style>
.mb-35 {
  margin-bottom: 35px !important;
}
</style>
