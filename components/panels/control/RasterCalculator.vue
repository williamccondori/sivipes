<template>
<el-row
  v-loading="loading"
  :gutter="20"
>
  <el-col :span="6">
    <div class="mb-1">
      <image-satelital />
    </div>
    <div class="mb-1">
      <el-select
        v-model="meters"
        placeholder="Seleccionar medida" @change="changeMeters"
      >
        <el-option
          label="10 metros"
          value="10"
        />
        <el-option
          label="20 metros"
          value="20"
        />
      </el-select>
    </div>
    <div class="mb-1">
      <el-select
        v-model="style"
        placeholder="Seleccionar estilo"
      >
        <el-option
          label="Magma"
          value="1"
        />
        <el-option
          label="Spectral"
          value="2"
        />
        <el-option
          label="Reds"
          value="3"
        />
        <el-option
          label="Blues"
          value="4"
        />
      </el-select>
    </div>
    <el-card
      v-for="band in filterBands"
      :key="band.id"
      class="card-band mb-2"
      shadow="hover"
      :style="'border-left: 3px solid '+ band.color"
    >
      <div @click="addBandComponent(band)">
        <h1>{{ band.name }}</h1>
        <h2>{{ band.description }}</h2>
      </div>
    </el-card>
  </el-col>
  <el-col :span="18">
    <el-row>
      <div class="mb-2">
        <el-tooltip
          v-for="operation in operations"
          :key="operation.id"
          class="item"
          effect="dark"
          :content="operation.description"
          placement="top-start"
        >
          <el-button
            :icon="operation.icon"
            type="primary"
            plain
            circle
            size="small"
            @click="addOperationComponent(operation)"
          />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark" placement="top-start" content="Combinar"
        >
          <el-button
            type="primary"
            plain
            circle
            size="small"
            icon="el-icon-connection"
            @click="addMergeComponent()"
          />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark" placement="top-start" content="Resultado"
        >
          <el-button
            type="warning"
            plain
            circle
            size="small"
            icon="el-icon-picture-outline"
            @click="addResultComponent()"
          />
        </el-tooltip>
        <el-button
          icon="el-icon-video-play"
          type="success"
          plain
          size="small"
          @click="calculate()"
        >Calcular</el-button>
        <el-button
          icon="el-icon-delete"
          type="danger"
          plain
          size="small"
          @click="clearAllNodes()"
        >Limpiar</el-button>
        <el-button
          v-if="selectedNode"
          icon="el-icon-delete"
          type="danger"
          plain
          size="small"
          @click="removeNode()"
        >{{ selectedNode.name }}</el-button>
      </div>
    </el-row>
    <div id="rete" />
  </el-col>
</el-row>
</template>
<script>
import { mapState } from 'vuex'
import Rete from 'rete'
import ConnectionPlugin from 'rete-connection-plugin'
import VueRenderPlugin from 'rete-vue-render-plugin'
import { tileLayer, geoJSON } from 'leaflet'
import ImageSatelital from '@/components/spectralIndexes/ImagesSatelitals.vue'
import mountableAsDynamicMixin from '@/mixins/mountableAsDynamic.mixin'
import { $_notify_success } from '@/use/notifications'

import { SUCCESS } from '@/config/messages'

let _container
let _editor
let _engine
let _bandComponents = {}
let _operationComponents = {}

const RESULT_COMPONENT = 'RES'

let temporalData = new Rete.Socket('Band')

class BandComponent extends Rete.Component {
  constructor (bandName, bandDescription = 'Band') {
    super('[' + bandName + '] ' + bandDescription)
    this.bandName = bandName
  }

  builder (node) {
    node.addOutput(new Rete.Output('band', this.bandName, temporalData))
  }
  // eslint-disable-next-line no-unused-vars
  worker (node, inputs, outputs) {
    outputs['band'] = this.bandName
  }
}

class OperationComponent extends Rete.Component {
  constructor (operation) {
    super(operation)
    this.operation = operation
  }

  builder (node) {
    node.addInput(new Rete.Input('a', 'Entrada', temporalData))
    node.addInput(new Rete.Input('b', 'Entrada', temporalData))
    node.addOutput(new Rete.Output('result', this.operation, temporalData))
  }

  worker (node, inputs, outputs) {
    let a = inputs['a'].length ? inputs['a'][0] : null
    let b = inputs['b'].length ? inputs['b'][0] : null
    if (a && b) {
      outputs['result'] = `[${a}${node.data.value}${b}]`
    }
  }
}

class OutputComponent extends Rete.Component {
  constructor () {
    super('Resultado')
  }

  builder (node) {
    node.addInput(new Rete.Input('result', 'Resultado', temporalData))
  }

  // eslint-disable-next-line no-unused-vars
  worker (node, inputs, outputs) {
    node.data.result = inputs['result'].length ? inputs['result'][0] : null
  }
}

class MergeComponent extends Rete.Component {
  constructor () {
    super('Combinar')
  }

  builder (node) {
    let red = new Rete.Input('red', 'Rojo', temporalData)
    let green = new Rete.Input('green', 'Verde', temporalData)
    let blue = new Rete.Input('blue', 'Azul', temporalData)
    let output = new Rete.Output('merge', 'Salida', temporalData)
    return node
      .addInput(red)
      .addInput(green)
      .addInput(blue)
      .addOutput(output)
  }
}

export default {
  components: {
    ImageSatelital
  },
  mixins: [mountableAsDynamicMixin],
  data: () => ({
    layerResult: null,
    dynamicTitle: 'Calculadora ráster',
    loading: false,
    meters: null,
    filterBands: [],
    selectedNode: null,
    satelitalImage: null,
    style: null,
    operations: [
      {
        id: 'SUM',
        sign: '+',
        description: 'Suma',
        icon: 'el-icon-plus'
      },
      {
        id: 'RES',
        sign: '-',
        description: 'Resta',
        icon: 'el-icon-minus'
      },
      {
        id: 'MUL',
        sign: '*',
        description: 'Multiplicación',
        icon: 'el-icon-close'
      },
      {
        id: 'DIV',
        sign: '/',
        description: 'División',
        icon: 'el-icon-minus'
      }
    ]
  }),
  computed: {
    ...mapState({
      bands: state => state.satelitalImages.bands,
      imageSatelital: state => state.satelitalImages.itemContext,
      resultFromRasterCalculator: state => state.rasterCalculator.resultFromRasterCalculator
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.dispatch('satelitalImages/getBands')
      this.loadEditor()
    })
  },
  methods: {
    error (message) {
      this.$notify({
        title: 'Error!',
        message: message,
        type: 'error'
      })
    },
    addResultToMap () {
      this.layerResult = tileLayer.wms(this.resultFromRasterCalculator.url, {
        layers: this.resultFromRasterCalculator.layer,
        format: 'image/png',
        transparent: true,
        zIndex: 200
      })
      this.$L.map.addLayer(this.layerResult)
      const parseGeometry = JSON.parse(this.resultFromRasterCalculator.geometry)
      this.$L.map.fitBounds(geoJSON(parseGeometry).getBounds())
    },
    async calculate () {
      if (!this.style){
        this.error('Seleccione un estilo!')
        return
      }
      if (_editor) {
        const nodes = _editor.toJSON().nodes
        const parent = []
        for (let key in nodes) {
          if (nodes[key].data) {
            if (nodes[key].data.type === RESULT_COMPONENT) {
              parent.push(nodes[key])
            }
          }
        }
        if (parent.length == 1) {
          if (parent[0].data.result) {
            this.loading = true
            const form = {
              satelital_image: this.imageSatelital.id,
              operation: parent[0].data.result,
              style: parseInt(this.style),
              type: 'O'
            }
            // console.log(form, 'result')
            try {
              await this.$store.dispatch('rasterCalculator/getResultFromRasterCalculator', form)
              $_notify_success(SUCCESS.RESULT)
              this.addResultToMap()
              this.loading = false
            } catch (error) {
              this.loading = false
            }
          } else {
            this.error('El resultado no presenta un valor válido!')
          }
        } else {
          this.error('Se debe proporcionar un resultado!')
        }
      }
    },
    changeMeters () {
      this.filterBands = []
      this.filterBands = this.bands.filter(p => p.meters == this.meters)
      this.removeAllNodes()
      // Se registran las bandas.
      this.bands.forEach(band => {
        if (!_bandComponents[band.id]) {
          _bandComponents[band.id] = new BandComponent(band.id, band.description)
          if (_editor) _editor.register(_bandComponents[band.id])
          if (_engine) _engine.register(_bandComponents[band.id])
        }
      })
    },
    loadEditor () {
      // Selecciona el elemento.
      _container = document.querySelector('#rete')
      // Crea el editor.
      if (!_editor) {
        _editor = new Rete.NodeEditor('demo@0.1.0', _container)
        // Inicialización de plugins.
        _editor.use(ConnectionPlugin)
        _editor.use(VueRenderPlugin)
        // Se crea el engine y los eventos necesarios.
        _engine = new Rete.Engine('demo@0.1.0')
        _editor.on('nodecreated noderemoved connectioncreated connectionremoved', async () => {
          await _engine.abort()
          await _engine.process(_editor.toJSON())
        })
        // Se registran las operaciones.
        this.operations.forEach(operation => {
          _operationComponents[operation.id] = new OperationComponent(operation.description)
          if (_editor) _editor.register(_operationComponents[operation.id])
          if (_engine) _engine.register(_operationComponents[operation.id])
        })
        _operationComponents['MER'] = new MergeComponent()
        if (_editor) _editor.register(_operationComponents['MER'])
        if (_engine) _engine.register(_operationComponents['MER'])
        _operationComponents['OUT'] = new OutputComponent()
        if (_editor) _editor.register(_operationComponents['OUT'])
        if (_engine) _engine.register(_operationComponents['OUT'])
        _editor.on('nodeselect', node => {
          this.selectedNode = node
        })
      } else _editor.clear()
    },
    async addBandComponent (band) {
      let bandComponent = _bandComponents[band.id]
      let node = await bandComponent.createNode({ value: band.id })
      node.position = [
        100, 50
      ]
      if (_editor) _editor.addNode(node)
    },
    async addOperationComponent (operation) {
      let operationComponent = _operationComponents[operation.id]
      let node = await operationComponent.createNode({ value: operation.sign })
      node.position = [
        100, 50
      ]
      if (_editor) _editor.addNode(node)
    },
    async addMergeComponent () {
      let mergeComponent = _operationComponents['MER']
      let node = await mergeComponent.createNode()
      node.position = [
        100, 50
      ]
      if (_editor) _editor.addNode(node)
    },
    async addResultComponent () {
      let resultComponent = _operationComponents['OUT']
      let node = await resultComponent.createNode({ type: RESULT_COMPONENT })
      node.position = [
        100, 50
      ]
      if (_editor) _editor.addNode(node)
    },
    async removeNode () {
      if (this.selectedNode) if (_editor) _editor.removeNode(this.selectedNode)
      this.selectedNode = null
    },
    removeAllNodes () {
      this.selectedNode = null
      _editor.clear()
    },
    clearAllNodes () {
      this.filterBands = []
      this.selectedNode = null
      this.style = null
      this.meters = null
      // limpiarrrrrrrrr this.imageSatelital = null
      _editor.clear()
    }
  }
}
</script>

<style lang="sass" scoped>
.el-select
    width: 100%
.el-button
  text-transform: none !important
.card-band
    cursor: pointer
    h1
        font-weight: bolder
        font-size: .9rem
    h2
        font-size: .8rem
#rete
  width: calc(100% - 5px) !important
  height: calc(100vh - 120px) !important
  background-color: #f5f5f5
  margin-right: 40px
.el-form-item
    margin-bottom: 10px
    font-size: 16px
.el-autocomplete
  margin-bottom: 0px !important
</style>
