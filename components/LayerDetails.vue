<template>
<pre>
  {{ properties }}
</pre>
</template>

<script>
import mountableAsDynamicMixin from '@/mixins/mountableAsDynamic.mixin'

export default {
  mixins: [mountableAsDynamicMixin],

  props: {
    properties: {
      type: Object, default: () => ({})
    }
  },

  data: () => ({
    dynamicTitle: ''
  }),

  beforeMount () {
    this.dynamicTitle = this.properties.geometry.type
  }
}
</script>
