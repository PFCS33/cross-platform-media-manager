<template>
  <div class="container">login done</div>
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
}
</style>
