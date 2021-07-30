<template>
<section v-loading="$store.state.spinners.LOADING_DRAWER">
  <el-card
    v-for="(projectImage, index) in projectImages" :key="index"
    shadow="hover"
    class="card-satelital-images"
  >
    <el-row type="flex">
      <el-col
        :xs="22" :md="22"
      >
        <div class="el-card__body__details">
          <div class="el-card__body__details--image">
            <el-image
              style="width: 50px"
              :src="projectImage.image"
              fit="cover"
            />
          </div>
          <div class="el-card__body__details--text">
            <div style="font-weight: 800">
              {{ projectImage.name }}
            </div>
            <div>
              <i class="el-icon-date" /> {{ projectImage.date | filterFormat }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="2" :md="2"
      >
        <div
          class="el-card__body__actions"
        >
          <el-tooltip
            content="Ver en mapa"
            class="item" effect="dark" placement="top"
          >
            <el-button
              ref="viewBtn"
              type="primary"
              size="mini"
              icon="el-icon-view"
              circle
              :plain="!projectImage.visible"
              @click="viewLayer($event, projectImage)"
            />
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
  </el-card>

  <h4
    v-if="!projectImages"
    class="text-center my-2"
  >No se encontraron imágenes
  </h4>
</section>
</template>

<script>
//import { mapState } from 'vuex'

//import { SPINNERS } from '@/store/mutations.types'
import { SERVICES } from '@/services/services.types'

export default {
  filters: {
    filterFormat (val) {
      return val.split('.')[0]
    }
  },

  computed: {
  },

  created () {
    //this.init()
  },

  methods: {
    viewLayer (e, projectImageLayer) {
      // prevent focus on btn
      e.currentTarget.blur()
      this.$_leafLet_service(SERVICES.LEAFLET.VIEW_LAYER, projectImageLayer, this.$L.WMSProjectLayers, 'satelitalImages', 'dataContext')
    },
    /**
    async init () {
      const project = this.$store.state.projects.itemContext.id
      try {
        await this.$_request_service(this.$store.dispatch(`satelitalImages/getDataContext`, project), SPINNERS.LOADING_DRAWER)
      } catch {
      }
    }
    */
  }
}
</script>
