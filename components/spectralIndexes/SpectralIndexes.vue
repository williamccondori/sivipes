<template>
<el-main>
  <div style="display:flex;">
    <el-autocomplete
      v-model="searchImage"
      :fetch-suggestions="querySearch"
      placeholder="Selecciona una imagen del proyecto"
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
            :src="item.image" fit="cover"
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
    <el-tooltip
      content="Limpiar todo"
      class="item" effect="dark" placement="top"
    >
      <el-button
        type="danger"
        size="mini" class="pa-1 h-100" plain @click="clearAll"
      >
        <span class="material-icons">clear_all</span>
      </el-button>
    </el-tooltip>
  </div>

  <template v-for="(item, i) in spectralIndexes">
    <card-spectral-index
      :key="i"
      :spectral-index="item"
    />
  </template>
</el-main>
</template>

<script>
import mountableAsDynamicMixin from '@/mixins/mountableAsDynamic.mixin'
import CardSpectralIndex from '@/components/spectralIndexes/CardSpectralIndex.vue'
import { mapState, mapGetters } from 'vuex'
import { SET_DATA_CONTEXT, SET_SIDE_BY_SIDE_VISIBLE } from '@/store/mutations.types'
export default {
  components: {
    CardSpectralIndex
  },
  mixins: [mountableAsDynamicMixin],

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
      const params = { satelitalImage: item.id }
      this.$store.commit(`satelitalIndexes/${SET_DATA_CONTEXT}`, [])
      this.$store.dispatch('satelitalIndexes/getDataContext', params)
      this.searchImage = ''
    },
    clearAll () {
      this.$store.commit(`satelitalIndexes/${SET_SIDE_BY_SIDE_VISIBLE}`, false)
      this.$store.commit(`satelitalIndexes/${SET_DATA_CONTEXT}`, [])
    }
  }
}
</script>
