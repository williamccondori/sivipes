<template>
<section>
  <el-card
    v-for="(satelitalImage, index) in satelitalImages" :key="index"
    shadow="hover"
    class="card-satelital-images"
  >
    <el-row type="flex">
      <el-col
        :xs="20" :md="20"
      >
        <div class="el-card__body__details">
          <div class="el-card__body__details--image">
            <el-image
              style="width: 50px"
              :src="satelitalImage.image"
              fit="cover"
            />
          </div>
          <div class="el-card__body__details--text">
            <div style="font-weight: 800">
              {{ satelitalImage.name }}
            </div>
            <div>
              <i class="el-icon-date" /> {{ satelitalImage.date | filterFormat }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="4" :md="4"
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
              :plain="!satelitalImage.visible"
              @click="viewLayer($event, satelitalImage)"
            />
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
  </el-card>

  <h4
    v-if="!satelitalImages"
    class="text-center"
  >No se encontraron imágenes
  </h4>
</section>
</template>

<script>
import { SERVICES } from '@/services/services.types'

export default {
  filters: {
    filterFormat (val) {
      return val.split('.')[0]
    }
  },

  props: {
    satelitalImages: {
      type: Array, default: () => ([])
    }
  },

  methods: {
    viewLayer (e, satelitalImageLayer) {
      // prevent focus on btn
      e.currentTarget.blur()
      this.$_leafLet_service(SERVICES.LEAFLET.VIEW_LAYER, satelitalImageLayer, this.$L.WMSSatelitalLayers, 'satelitalImages', 'satelitalImagesFiltered')
      this.$store.commit('common/increment', satelitalImageLayer.name)
    },
  }
}
</script>
