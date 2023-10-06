<template>
  <div class="container">
    <nav class="navbar"></nav>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    isLogin() {
      return this.$store.getters["auth/isLogin"];
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  @include container-base();
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 3rem;
  }
}
</style>
