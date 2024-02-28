<template>
  <div class="dashboard-container">
    <span>~~欢迎使用成人教研排课系统~~</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters({
      token: 'token'
    })
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
.dashboard-container {
  padding-top: 30vh;
  text-align: center;
  font-size: 30px;
  span {
    cursor: pointer;
  }
}
</style>
