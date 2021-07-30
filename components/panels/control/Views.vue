<template>
<div v-loading="$store.state.spinners.LOADING_DRAWER">
  <el-button
    :loading="$store.state.spinners.PROCESSING_FORM"
    type="success"
    class="full-width"
    @click="$_dialogDynamicMixin_dialogOpen('addView')"
  > <i class="el-icon-plus" /> Crear Vista
  </el-button>

  <el-card
    v-for="(item, i) in views"
    :key="i"
    shadow="hover"
    class="card-views my-2"
  >
    <h5 class="text-uppercase">{{ item.name }}</h5>
    <p>
      <small>
        <i class="el-icon-zoom-in" /> {{ item.zoom }}
      </small>
    </p>
    <p>
      <small>
        <i class="el-icon-coordinate" />
        {{ `${item.latitude} : ${item.longitude}` }}
      </small>
    </p>
    <div class="pt-1 text-right">
      <el-tooltip
        content="Ver"
        class="item"
        effect="dark"
        placement="top"
      >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-view"
          circle
          plain
          @click="viewInMap(item)"
        />
      </el-tooltip>
      <el-tooltip
        content="Eliminar"
        class="item"
        effect="dark"
        placement="top"
      >
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          circle
          plain
          @click="openConfirmDelete(item)"
        />
      </el-tooltip>
    </div>
  </el-card>

  <dialog-dynamic
    ref="dialogDynamic"
    :component="dialogDynamic[dialogDynamicMixin_componentSelected]"
    @dialog-close="$_dialogDynamicMixin_dialogClose"
  />
</div>
</template>

<script>
import mountableAsDynamicMixin from "@/mixins/mountableAsDynamic.mixin"
import dialogDynamicMixin from "@/mixins/dialogDynamic.mixin"
import { mapState } from 'vuex'
import { $_notify_success } from "@/use/notifications"
import { SUCCESS } from '@/config/messages'

export default {
  mixins: [
    mountableAsDynamicMixin, dialogDynamicMixin
  ],

  data: () => ({
    // defined if mountableAsDynamicMixin is included
    dynamicTitle: 'Vistas',
    dialogDynamic: {
      addView: {
        type: 'component',
        path: 'views/AddView'
      }
    }
  }),

  computed: {
    ...mapState({
      project: (state) => state.projects.itemContext,
      views: (state) => state.views.dataContext
    })

  },
  mounted () {
    const params = { project_id: this.project.id }
    this.$store.dispatch('views/getDataContext', params)
  },
  methods: {
    viewInMap (view) {
      this.$L.map.setView([
        view.latitude, view.longitude
      ], view.zoom)
    },
    openConfirmDelete (view) {
      this.$confirm('¿ Esta seguro de eliminar la vista ?', 'Eliminar vista', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        type: 'error'
      }).then(() => {
        const { id } = view
        this.deleteView(id)
        // eslint-disable-next-line no-unused-vars
      }).catch(err => { })
    },
    async deleteView (id) {
      try {
        await this.$store.dispatch('views/deleteItemContext', id)
        $_notify_success(SUCCESS.DELETED)
        this.$store.dispatch('views/getDataContext')
      } catch (error) { }
    }
  },
}
</script>
