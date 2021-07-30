<template>
<section>
  <el-card
    v-for="(polygon, index) in polygons" :key="index"
    shadow="hover"
    class="card-polygon"
  >
    <div class="el-card__body__details">
      {{ polygon.name }}
    </div>
    <div class="el-card__body__actions">
      <el-tooltip
        content="Ver"
        class="item" effect="dark" placement="top"
      >
        <el-button
          ref="viewBtn"
          type="primary"
          size="mini"
          icon="el-icon-view"
          circle
          :plain="!polygon.visible"
          @click="onViewPolygon($event, polygon)"
        />
      </el-tooltip>

      <el-tooltip
        content="Eliminar"
        class="item" effect="dark" placement="top"
      >
        <el-popconfirm
          confirm-button-text="Si"
          cancel-button-text=" No "
          icon="el-icon-info"
          icon-color="red"
          title="Está seguro de eliminar el polígono?"
          @onConfirm="$emit('delete-polygon', polygon)"
        >

          <el-button
            slot="reference"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            circle
          />
        </el-popconfirm>
      </el-tooltip>
    </div>
  </el-card>
  <h4
    v-if="!polygons.length"
    class="text-center"
  >No se encontraron polígonos
  </h4>
</section>
</template>

<script>
export default {
  props: {
    polygons: {
      type: Array, default: () => ([])
    }
  },

  methods: {
    onViewPolygon (e, polygon) {
      // prevent blur when click button
      e.currentTarget.blur()
      this.$emit('view-polygon', polygon)
    }
  }
}
</script>
