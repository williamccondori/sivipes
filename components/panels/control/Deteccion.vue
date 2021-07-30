<template>
<div v-loading="$store.state.spinners.LOADING_DRAWER">
  <p> Puede seleccionar una imagen completa o enviar la imagen y un área específica </p>

  <send-deteccion />

  <el-divider />

  <list-images
    v-loading="$store.state.spinners.PROCESSING_FORM"
    :satelital-images="satelitalImagesFiltered"
  />

</div>
</template>

<script>
import SendDeteccion from "@/components/catalogue/SendDeteccion"
import ListImages from "@/components/catalogue/ListImages"

import mountableAsDynamicMixin from "@/mixins/mountableAsDynamic.mixin"

import { mapState } from 'vuex'

export default {
  components: {
    SendDeteccion,
    ListImages
  },

  mixins: [mountableAsDynamicMixin],

  data: () => ({
    // defined if mountableAsDynamicMixin is included
    dynamicTitle: 'Modulo de Detección',
  }),

  computed: {
    ...mapState({
      satelitalImagesFiltered: (state) => state.satelitalImages.satelitalImagesFiltered,
    })
  },
}
</script>
