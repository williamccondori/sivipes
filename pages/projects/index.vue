<template>
<div>
  <el-row :gutter="10">
    <el-col
      :sm="12"
      :md="18"
      :lg="18"
    >
      <div class="pt-2 pl-2 header-projects">
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="mr-3 mb-3"
          @click="$_dialogDynamicMixin_dialogOpen('addProject')"
        >Nuevo proyecto</el-button>
        <el-input
          v-model="search"
          placeholder="Buscar..."
          class="pb-3"
          suffix-icon="el-icon-search"
          style="width:290px"
          clearable
        />
      </div>
      <div class="projects">
        <div
          v-for="project in projects"
          :key="project.id"
          class="card-projects px-2"
        >
          <projectcard :data="project" />
        </div>
      </div>
    </el-col>
    <el-col
      :sm="12"
      :md="6"
      :lg="6"
      class="pt-2"
    >
      <el-card class="app-card-info">
        <h1>¿Qué es un proyecto?</h1>
        En tus proyectos se guardan las areas mapeadas ademas de las detecciones que has realizado.
      </el-card>
    </el-col>
  </el-row>

  <dialog-dynamic
    ref="dialogDynamic"
    :component="dialogDynamic[dialogDynamicMixin_componentSelected]"
    @dialog-close="$_dialogDynamicMixin_dialogClose"
  />
</div>
</template>

<script>
import dialogDynamicMixin from "@/mixins/dialogDynamic.mixin"
import projectcard from '~/components/projects/card.vue'
import { mapState } from 'vuex'

export default {
  layout: 'admin',
  components: {
    projectcard
  },
  mixins: [dialogDynamicMixin],

  data () {
    return {
      search: '',
      dialogDynamic: {
        addProject: {
          type: 'component',
          path: 'projects/AddProject'
        }
      }
    }
  },
  computed: {
    ...mapState({
      dataContext: (state) => state.projects.dataContext
    }),
    projects: function () {
      let results = this.$store.state.projects.dataContext
      if (this.search) {
        const searchUppercase = this.search.toLowerCase()
        results = this.dataContext.filter(item => {
          return item.name.toLowerCase().includes(searchUppercase)
        })
      }
      return results
    }
  },

  created () {
    this.$store.dispatch('projects/getDataContext')
  }
}
</script>

<style>
</style>
