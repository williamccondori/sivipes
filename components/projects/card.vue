<template>
<div>
  <el-card
    class="card mb-3"
    shadow="hover"
    :body-style="{ padding: '0px' }"
  >
    <nuxt-link :to="{ path: `/projects/${data.id}` }">
      <img :src="data.image || 'https://upload.wikimedia.org/wikipedia/commons/2/20/Imagen_Satelital_de_Cucuta.jpg'">
      <div class="content">
        <h5 class="text-uppercase">{{ data.name }}</h5>
        <p>{{ data.description }}</p>
      </div>
    </nuxt-link>
    <div class="el-card__footer right">

      <el-tooltip
        content="Editar"
        class="item"
        effect="dark"
        placement="top"
      >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-edit"
          circle
          @click="dialogOpen(data)"
        />
      </el-tooltip>
      <!-- <el-tooltip
        content="Compartir"
        class="item"
        effect="dark"
        placement="top"
      >
        <el-button
          type="success"
          size="mini"
          icon="el-icon-share"
          circle
        />
      </el-tooltip> -->
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
          @click="openConfirmDelete(data)"
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
import { SET_ITEM_CONTEXT } from "@/store/mutations.types"
import dialogDynamicMixin from "@/mixins/dialogDynamic.mixin"
import { $_notify_success } from "@/use/notifications"
import { SUCCESS } from '@/config/messages'

export default {

  mixins: [dialogDynamicMixin],
  // eslint-disable-next-line vue/require-prop-types
  props: ['data'],
  data () {
    return {
      dialogDynamic: {
        editProject: {
          type: 'component',
          path: 'projects/EditProject'
        }
      }
    }
  },
  methods: {
    openConfirmDelete (item) {
      this.$confirm('¿ Esta seguro de eliminar el proyecto ?', 'Eliminar proyecto', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        type: 'error'
      }).then(() => {
        const { id } = item
        this.deletedProjects(id)
        // eslint-disable-next-line no-unused-vars
      }).catch(err => { })
    },
    async deletedProjects (id) {
      try {
        await this.$store.dispatch('projects/deleteItemContext', id)
        $_notify_success(SUCCESS.DELETED)
        this.$store.dispatch('projects/getDataContext')
      } catch (error) { }
    },
    dialogOpen (item) {
      this.$store.commit(`projects/${SET_ITEM_CONTEXT}`, item)
      this.$_dialogDynamicMixin_dialogOpen('editProject')
    }
  }
}
</script>

<style lang="sass" scoped>
.card
  img
    width: 100%
  .content
    padding: 1em
</style>
