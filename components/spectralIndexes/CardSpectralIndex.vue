<template>
<div>
  <el-card
    shadow="hover"
    class="card-spectral-index"
  >
    <div class="content-spectral-index">
      <el-image
        style="width: 70px; height: 70px"
        :src="spectralIndex.image.result"
        fit="cover"
        lazy
      >
        <div
          slot="error"
          class="image-error-slot"
        >
          <i class="el-icon-picture-outline" />
        </div>
      </el-image>
      <div class="detail">
        <h5 class="title">{{ spectralIndex.title }}</h5>
        <p>{{ spectralIndex.description }}</p>
        <div class="actions">
          <el-tooltip
            content="Ver"
            class="item"
            effect="dark"
            placement="top"
          >
            <el-button
              ref="viewBtn"
              type="primary"
              size="mini"
              icon="el-icon-view"
              circle
              :plain="!spectralIndex.isVisible"
              @click="viewInMapSpectralIndex(spectralIndex)"
            />
          </el-tooltip>
          <el-button
            type="text"
            class="actions__btn"
            @click="openDialog(spectralIndex)"
          >
            <i class="el-icon-full-screen" />
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
  <el-dialog
    :title="spectralIndex.title"
    :visible.sync="dialogFormVisible"
  >
    <el-image
      style="width: 100%; height: 75vh"
      :src="spectralIndex.image.result"
      fit="contain"
    />
  </el-dialog>
  <dialog-dynamic
    ref="dialogDynamic"
    :component="dialogDynamic[dialogDynamicMixin_componentSelected]"
    @dialog-close="$_dialogDynamicMixin_dialogClose"
  />
</div>

</template>

<script>
import dialogDynamicMixin from "@/mixins/dialogDynamic.mixin"
import {
  SET_SELECTED_SATELITAL_INDEX,
  SET_ITEM_CONTEXT,
  SET_SIDE_BY_SIDE_VISIBLE,
  SET_LAYER_SATELITAL_INDEX
} from '@/store/mutations.types'
import { mapState } from 'vuex'
export default {
  mixins: [ dialogDynamicMixin ],
  props: {
    spectralIndex: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    isVisible: false,
    dialogFormVisible: false,
    dynamicTitle: '',
    dialogDynamic: {
      fullScreenSpectralIndex: {
        type: 'component',
        path: 'spectralIndexes/FullScreenSpectralIndex'
      }
    }
  }),

  computed: {
    ...mapState({
      sideBySideVisible: (state) => state.satelitalIndexes.sideBySideVisible,
      satelitalIndex: (state) => state.satelitalIndexes.layerSatelitalIndex
    }),
  },
  mounted () {
    this.dynamicTitle = this.spectralIndex.title
  },

  methods: {
    viewInMapSpectralIndex (item) {
      if (item.isVisible) {
        this.$store.commit(`satelitalIndexes/${SET_SIDE_BY_SIDE_VISIBLE}`, false)
        return false
      }
      this.$store.commit(`satelitalIndexes/${SET_SIDE_BY_SIDE_VISIBLE}`, true)
      const layerBase = {
        geometry: item.geometry,
        baseUrl: item.service,
        layer: item.layer.base,
        typeImage: 'layerBase',
      }
      const layerResult = {
        baseUrl: item.service,
        layer: item.layer.result,
        typeImage: 'layerResult',
      }

      this.$store.commit(`satelitalIndexes/${SET_SELECTED_SATELITAL_INDEX}`, item)
      this.$store.commit(`satelitalIndexes/${SET_LAYER_SATELITAL_INDEX}`, [
        layerBase, layerResult
      ])
    },
    closeInMapSpectralIndex () {
      this.$store.commit(`satelitalIndexes/${SET_SIDE_BY_SIDE_VISIBLE}`, false)
    },
    openDialog (item) {
      this.$store.commit(`satelitalIndexes/${SET_ITEM_CONTEXT}`, item)
      this.$_dialogDynamicMixin_dialogOpen('fullScreenSpectralIndex')
    }
  },
}
</script>
