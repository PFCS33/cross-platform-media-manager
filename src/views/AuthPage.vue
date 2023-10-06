<template>
  <div class="container">
    <div class="half left">
      <BaseCard inset class="slogan">
        <div>An</div>
        <p class="hilight-sentence">all in one</p>
        <p class="long-sentence">
          social media manager, boosting your productivity with security
        </p>
      </BaseCard>
    </div>
    <div class="half right"></div>
    <LoginCard class="auth-card"></LoginCard>
  </div>
</template>

<script>
import LoginCard from "../components/auth/Login.vue";
export default {
  components: { LoginCard },
  data() {
    return {
      mode: "login",
    };
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
  display: flex;
  .half {
    height: 100%;
  }
  .left {
    background-color: $secondary-color;
    flex: 1 1 61.8%;

    box-shadow: 0.5rem 0rem 1.5rem 0rem rgba(0, 0, 0, 0.2);
    z-index: 1;
    // width: 50%;

    .slogan {
      user-select: none;
      width: fit-content;
      height: fit-content;
      padding: 4rem 2rem;
      position: fixed;
      top: 28%;
      left: 3%;
      border-radius: 1.2rem;
      background-color: rgba($secondary-color-dark, 0.3);

      color: rgba($primary-color, 0.8);
      font-size: 1.5rem;
      line-height: 1.2;
      text-shadow: 1rem 0.5rem 0.3rem $secondary-color-dark;
      letter-spacing: 0.15rem;
    }
    .hilight-sentence {
      text-transform: uppercase;
      font-size: 9rem;
      color: $primary-color;
    }
    .long-sentence {
      width: 70%;
      word-wrap: break-word;
    }
  }

  .right {
    background-color: $primary-color;
    flex: 1 1 38.2%;
  }
  .auth-card {
    position: fixed;
    top: 15%;
    left: 50%;
    width: 35vw;
    height: 70vh;
    z-index: $z-middle;
  }
}
</style>
