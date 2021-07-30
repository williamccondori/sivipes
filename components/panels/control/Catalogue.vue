<template>
<div v-loading="$store.state.spinners.LOADING_DRAWER">

  <search-images />

  <el-divider />

  <list-satelital-images
    v-loading="$store.state.spinners.PROCESSING_FORM"
    :satelital-images="satelitalImagesFiltered"
  />

</div>
</template>

<script>
import SearchImages from "@/components/catalogue/SearchImages"
import ListSatelitalImages from "@/components/catalogue/ListSatelitalImages"

import mountableAsDynamicMixin from "@/mixins/mountableAsDynamic.mixin"

import { mapState } from 'vuex'

export default {
  components: {
    SearchImages,
    ListSatelitalImages
  },

  mixins: [mountableAsDynamicMixin],

  data: () => ({
    // defined if mountableAsDynamicMixin is included
    dynamicTitle: 'Catálogo de Imágenes',
  }),

  computed: {
    ...mapState({
      satelitalImagesFiltered: (state) => state.satelitalImages.satelitalImagesFiltered
    })
  },
}
</script>
