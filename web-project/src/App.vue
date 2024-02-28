<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  watch: {
    'userInfo.uid': {
      handler (val) {
      },
      immediate: true
    }
  },
  destroyed () {
  }
}
</script>
