<template>
  <div class="container">
    <Sidebar class="sidebar"></Sidebar>
    <div class="content-box">
      <nav class="navbar"></nav>
      <div class="content">
        <router-view v-slot="slotProps">
          <transition name="route" mode="out-in">
            <component :is="slotProps.Component"> </component>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/project/Sidebar.vue";
export default {
  components: {
    Sidebar,
  },
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
  @include flex-box(row);
  background-color: $secondary-color-dark;

  .content-box {
    flex: 1 1 0;
    background-color: $background-color;
    border-radius: 2rem;
    margin: 2rem 2rem 2rem 0rem;
  }
}
</style>
<style lang="scss" scoped>
@include router-animation();
</style>
