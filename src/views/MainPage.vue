<template>
  <div class="container">
    <Sidebar class="sidebar" :userName="userInfo.name"></Sidebar>
    <div class="content-box">
      <router-view v-slot="slotProps">
        <transition name="route" mode="out-in">
          <component :is="slotProps.Component"> </component>
        </transition>
      </router-view>
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
    userInfo() {
      return this.$store.getters["auth/userInfo"];
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
    background-color: $background-color-gray;
    box-shadow: 0.3rem 0.3rem 0.5rem 0.2rem rgba($secondary-color, 0.3) inset;
    border-radius: 2rem;
    margin: 2rem 2rem 2rem 0rem;
    overflow: hidden;
  }
}
</style>
<style lang="scss" scoped>
@include router-animation();
</style>
