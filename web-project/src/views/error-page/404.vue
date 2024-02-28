<template>
  <div class="container-404">
    <h1>404</h1>
    <p>Sorry, the page you are looking for could not be found.</p>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message () {
      return 'The webmaster said that you can not enter this page...'
    }
  }
}
</script>

<style lang="scss" scoped>
.container-404 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  h1 {
    font-size: 10rem;
    color: #333;
    margin: 0;
  }

  p {
    font-size: 2rem;
    color: #999;
    margin: 0 0 2rem;
  }
}
</style>
