<template>
  <BaseCard class="card">
    <img class="icon" src="/auth-button.png" alt="auth-botton" />

    <div class="title-box">
      <h1 class="title main-title">create an account</h1>
      <span class="title sub-title">Provide your details</span>
    </div>
    <form class="signup-box" @submit.prevent="submitData" novalidate>
      <div class="input-box">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          v-model.trim="email.val"
          required
          @blur="validateEmail"
          ref="email"
        />
        <p class="error-msg" v-if="!email.isValid">Illegal Input</p>
      </div>
      <div class="input-box">
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          v-model.trim="password.val"
          pattern="(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9!@&*\(\)_+\{\}:;<>,.?~\/\-]{8,16}"
          required
          ref="password"
          @blur="validatePassword"
        />
        <p class="error-msg" v-if="!password.isValid">Illegal Input</p>
      </div>
      <div class="input-box">
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          v-model.trim="confirmPassword.val"
          pattern="(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9!@&*\(\)_+\{\}:;<>,.?~\/\-]{8,16}"
          required
          ref="confirmPassword"
          @blur="validateConfirmPassword"
        />
        <p class="error-msg" v-if="!confirmPassword.isValid">Illegal Input</p>
      </div>
      <div class="button-box">
        <BaseButton @click="submitForm">Signup</BaseButton>
      </div>
    </form>

    <div class="link-box">
      <span>Already a member?</span>
      <router-link :to="{ name: 'login' }"> Login </router-link>
    </div>
  </BaseCard>
</template>

<script>
export default {
  data() {
    return {
      email: {
        val: "",
        isValid: true,
      },
      password: {
        val: "",
        isValid: true,
      },
      confirmPassword: {
        val: "",
        isValid: true,
      },
      formIsValid: true,
    };
  },
  watch: {
    formIsValid(newVal) {
      if (!newVal) {
        ElMessage.warning(
          "Sorry, at least one of the input was detected as out of specification"
        );
        setTimeout(() => ElMessage.warning("Please try again"), 500);
        this.formIsValid = true;
      }
    },
  },
  methods: {
    submitForm() {
      if (this.validateForm()) {
        const fromData = {
          email: this.email.val,
          password: this.password.val,
        };

        this.$store.dispatch("auth/uploadData", {
          data: fromData,
          mode: "register",
        });
      }
    },
    validateForm() {
      if (
        this.validateEmail() &&
        this.validatePassword() &&
        this.validateConfirmPassword()
      ) {
        return true;
      } else {
        this.formIsValid = false;
        return false;
      }
    },

    validateEmail() {
      if (!this.$refs.email.checkValidity()) {
        this.email.isValid = false;
        return false;
      } else {
        this.email.isValid = true;
        return true;
      }
    },
    validatePassword() {
      if (!this.$refs.password.checkValidity()) {
        this.password.isValid = false;
        return false;
      } else {
        this.password.isValid = true;
        return true;
      }
    },
    validateConfirmPassword() {
      if (this.confirmPassword.val !== this.password.val) {
        this.confirmPassword.isValid = false;
        return false;
      } else {
        this.confirmPassword.isValid = true;
        return true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  width: 6rem;
  height: 6rem;
  position: absolute;
  z-index: $z-middle;
  top: -2rem;
  left: -2rem;
}
.card {
  background-color: $background-color-gray;
  border-radius: 1.2rem;

  @include flex-box(column);
  gap: 2rem;

  .title-box {
    padding-top: 10%;
    align-self: center;
    flex: 0 1 15%;
    @include flex-box(column);
    gap: 0.8rem;
    user-select: none;
    .title {
      align-self: center;
    }
    .main-title {
      align-self: center;
      text-transform: uppercase;
      letter-spacing: 0.3rem;
      font-size: 3rem;
    }
    .sub-title {
      color: $text-secondary-color;
    }
  }
  .signup-box {
    flex: 1 1 75%;
    @include flex-box(column);
    .input-box {
      flex: 1 1 25%;
      padding: 1.5rem 5rem;
      input {
        width: 100%;
        height: 100%;
        border-radius: 5rem;
        border: none;
        padding-left: 1rem;
        font-size: 1.5rem;
        transition: box-shadow 0.2s ease-in;

        &:focus {
          // outline: 0.2rem solid $secondary-color;
          outline: none;
          box-shadow: 0 0 0 0.2rem $secondary-color;
        }
        &::placeholder {
          color: $muted-text-color;
          opacity: 1; /* Firefox requires this to adjust color */
        }

        /* Internet Explorer, Edge */
        &:-ms-input-placeholder {
          color: $muted-text-color;
        }

        /* Safari < 10.1 */
        &::-webkit-input-placeholder {
          color: $muted-text-color;
        }
      }
    }
    .button-box {
      flex: 1 1 25%;
      padding: 0rem 5rem;
      padding-top: 1.5rem;
      button {
        width: 100%;
        height: 100%;
        border-radius: 5rem;

        font-size: 1.6rem;
      }
    }
    .error-msg {
      color: $red;
      padding-top: 0.2rem;
      padding-left: 1rem;
    }
  }
  .link-box {
    flex: 0 1 10%;
    @include flex-box(row);
    gap: 1rem;
    justify-content: center;
    user-select: none;
    span {
      color: $text-secondary-color;
    }
  }
  a {
    display: inline-block;
    text-decoration: none;
    color: $secondary-color;
    transition: transform 0.2s ease-out;

    &:hover {
      color: $secondary-color-dark;
      transform: scale(1.05);
    }
  }
}
</style>
