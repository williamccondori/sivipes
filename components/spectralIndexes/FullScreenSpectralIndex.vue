<template>
<div>
  <p>testsets</p>
  <el-image
    v-if="spectralIndex"
    style="width: 100%; height: 75vh"
    :src="spectralIndex.image.result"
    fit="contain"
  />
</div>
</template>
<script>
export default {
  data () {
    return {
      spectralIndex: null,
    }
  },
  mounted () {
    this.spectralIndex = this.$parent.$parent.$parent._props.spectralIndex
  },
}
</script>
