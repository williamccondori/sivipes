<template>
<div class="page-login">

  <sign-in />

  <dialog-dynamic
    ref="dialogDynamic"
    :component="dialogDynamic[dialogDynamicMixin_componentSelected]"
    @dialog-close="$_dialogDynamicMixin_dialogClose"
  />

</div>
</template>

<script>
import SignIn from '@/components/sign/SignIn'

import dialogDynamicMixin from "@/mixins/dialogDynamic.mixin"

export default {
  layout: 'login',

  components: {
    SignIn
  },

  mixins: [dialogDynamicMixin],

  data: () => ({
    dialogDynamic: {
      signUp: {
        type: 'component',
        path: 'sign/SignUp'
      }
    }
  })
}
</script>
