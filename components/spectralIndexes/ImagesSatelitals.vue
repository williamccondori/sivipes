<template>
<el-autocomplete
  v-model="searchImage"
  :fetch-suggestions="querySearch"
  placeholder="Seleccionar imagen"
  value-key="name"
  clearable
  :disabled="$store.state.spinners.processingForm"
  class="mr-3"
  @select="selectedImage"
>
  <template slot-scope="{ item }">
    <div class="scope-item">
      <el-image
        style="width: 50px; height: 50px"
        :src="item.image"
        fit="cover"
      >
        <div
          slot="error"
          class="image-error-slot"
        >
          <i class="el-icon-picture-outline" />
        </div>
      </el-image>
      <div class="item-content">
        <h6 class="title">{{ item.name }}</h6>
        <p>
          <i class="el-icon-date" />
          {{ item.date }}
        </p>
      </div>
    </div>
  </template>
</el-autocomplete>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { SET_ITEM_CONTEXT, SET_DATA_CONTEXT, SET_SIDE_BY_SIDE_VISIBLE } from '@/store/mutations.types'
export default {

  data: () => ({
    // defined if mountableAsDynamicMixin is included
    dynamicTitle: 'Indices espectrales',
    searchImage: ''
  }),
  computed: {
    ...mapState({
      satelitalImages: state => state.satelitalImages.dataContext,
      project: state => state.projects.itemContext
    }),
    ...mapGetters({
      spectralIndexes: 'satelitalIndexes/satelitalIndexes'
    })
  },
  created () {
    const project = this.$store.state.projects.itemContext.id

    this.$store.dispatch('satelitalImages/getDataContext', project)
  },
  methods: {
    querySearch (string, cb) {
      let results = this.satelitalImages
      if (string) {
        const stringToLowerCase = string.toLowerCase()
        results = this.satelitalImages.filter(item => {
          return item.name.toLowerCase().includes(stringToLowerCase)
        })
      }
      cb(results)
    },
    selectedImage (item) {
      this.$store.commit(`satelitalImages/${SET_ITEM_CONTEXT}`, item)
    },
    clearAll () {
      this.$store.commit(`satelitalIndexes/${SET_SIDE_BY_SIDE_VISIBLE}`, false)
      this.$store.commit(`satelitalIndexes/${SET_DATA_CONTEXT}`, [])
    }
  }
}
</script>
