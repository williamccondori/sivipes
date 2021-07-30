<template>
<div v-loading="$store.state.spinners.LOADING_DRAWER">

  <base-form
    ref="baseForm"
    custom-actions
    @apply-after-submit-form="applyAfterSubmitForm"
  >
    <el-form-item
      label="Link del servicio"
      prop="url"
    >
      <el-input
        ref="input"
        v-model="form.url"
        placeholder="Link del servicio"
        auto-complete="off"
        clearable
        @input="$refs.baseForm.clearValidate()"
      />
    </el-form-item>

    <template
      v-slot:custom-actions="{
        submitForm
      }"
    >
      <el-button
        :loading="$store.state.spinners.PROCESSING_FORM"
        icon="el-icon-search"
        type="success"
        class="full-width"
        @click="submitForm"
      >
        BUSCAR
      </el-button>

    </template>
  </base-form>
  <div
    v-if="wmsCapabilities"
    class="pt-4"
  >
    <el-tree
      ref="treeWMS"
      :data="treeData"
      show-checkbox
      node-key="id"
      default-expand-all
      :check-on-click-node="true"
      :props="{children: 'layers'}"
      @check-change="checkedNode"
    >
      <span
        slot-scope="{ node }"
        class="custom-tree-node"
      >
        <span v-html="node.label" />
      </span>
    </el-tree>
  </div>
</div>

</template>

<script>
import { tileLayer } from 'leaflet'
import mountableAsDynamicMixin from "@/mixins/mountableAsDynamic.mixin"
import BaseForm from '@/components/base/BaseForm'
import { required } from "@/config/form.rules"
import { mapState } from 'vuex'


export default {
  components: {
    BaseForm
  },
  mixins: [mountableAsDynamicMixin],

  data: () => ({
    // defined if mountableAsDynamicMixin is included
    dynamicTitle: 'Servicios WMS',
    form: {
      url: ''
    },
    rules: {
      url: required('la', 'url')
    },
    submit: {
      storeName: 'wmsCapabilities',
      storeAction: 'getWMSCapabilities',
      notifyType: 'SEARCHED'
    },

    options: {
      checkbox: true,
      propertyNames: {
        text: 'label',
        children: 'layers'
      }
    },
    webMapServiceLayer: null,
    zIndex: 2,
    layersId: []

  }),

  computed: {
    ...mapState({
      wmsCapabilities: (state) => state.wmsCapabilities.wmsCapabilities
    }),

    treeData: function () {
      let tree = []
      if (this.wmsCapabilities && typeof this.wmsCapabilities.content === 'object') {
        tree = [this.wmsCapabilities.content]
      }
      return tree
    }
  },

  methods: {
    applyAfterSubmitForm () {

    },

    addCapabilitiesInMap (nodeId) {
      const layerwms = tileLayer.wms(this.wmsCapabilities.url, {
        version: this.wmsCapabilities.version,
        format: 'image/png',
        transparent: true,
        width: 733,
        info_format: 'text/html',
        layers: `${nodeId}`,
        zIndex: `${1000 + this.zIndex}`
      })
      layerwms.addTo(this.$L.map)
      this.layersId.push({ nodeId, leafletId: layerwms._leaflet_id, layerwms })
      this.zIndex = this.zIndex + 1
    },
    // eslint-disable-next-line no-unused-vars
    checkedNode (node, isSelected, childrenSelected) {
      const { id } = node
      if (id !== null && isSelected) {
        this.addCapabilitiesInMap(id)
      } else if (id !== null && !isSelected) {
        let nodeNotChecked = this.layersId.find(val => val.nodeId  === id)
        let nodeNotCheckedIndex = this.layersId.indexOf(nodeNotChecked)
        this.layersId.splice(nodeNotCheckedIndex, 1)
        nodeNotChecked.layerwms.remove()
      }
    }
  },

  render: () => ({}),
}
</script>
