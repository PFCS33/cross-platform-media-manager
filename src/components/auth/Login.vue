<template>
  <BaseCard class="card">
    <el-dialog v-model="policyShow" title="Privacy Policy">
      <div class="content">Balabala...</div>
      <template #footer>
        <span class="dialog-footer">
          <BaseButton @click="policyShow = false">Cancel</BaseButton>
          <BaseButton
            class="check"
            @click="
              policyShow = false;
              policyChecked = true;
            "
          >
            Confirm
          </BaseButton>
        </span>
      </template>
    </el-dialog>
    <img class="icon" src="/auth-button.png" alt="auth-botton" />
    <div class="title-box">
      <h1 class="title main-title">welcome</h1>
      <span class="title sub-title">Login to your account</span>
    </div>
    <form class="login-box" @submit.prevent="submitData" novalidate>
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
        <transition name="form-msg">
          <p class="error-msg" v-if="!email.isValid">Illegal Input</p>
        </transition>
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
        <transition name="form-msg">
          <p class="error-msg" v-if="!password.isValid">Illegal Input</p>
        </transition>
      </div>
      <div class="policy-box">
        <el-checkbox v-model="policyChecked">
          <template v-slot="lable">
            <span>I have read and accept the </span>
            <span class="policy-link" @click="togglePolicy"
              >Privacy Policy</span
            >
          </template>
        </el-checkbox>
      </div>
      <div class="link-box">
        <router-link to="">Forgot Password</router-link>
      </div>
      <div class="button-box">
        <BaseButton @click="submitForm">Login</BaseButton>
      </div>
    </form>

    <div class="signup-box">
      <span>Dont't have an account?</span>
      <router-link :to="{ name: 'signup' }"> Signup </router-link>
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
      policyChecked: false,
      policyShow: false,
      formIsValid: {
        state: true,
        mode: null,
      },
    };
  },
  computed: {},
  watch: {
    formIsValid(newVal) {
      if (!newVal.state) {
        switch (newVal.mode) {
          case "format":
            ElNotification({
              title: "Input Format Error",
              message: `at least one of the input was detected as out of specification. Please try again`,
              type: "warning",
            });
            break;
          case "policy":
            ElNotification({
              title: "Privacy Policy Unchecked",
              message: `Please read and confirm our privacy policy before you use our application`,
              type: "warning",
            });
            break;
        }

        this.formIsValid = {
          state: true,
          mode: null,
        };
      }
    },
  },
  methods: {
    togglePolicy(event) {
      // 防止事件冒泡，stopPropagation 不行
      event.preventDefault();
      this.policyShow = !this.policyShow;
    },
    submitForm() {
      if (this.validateForm()) {
        const fromData = {
          email: this.email.val,
          password: this.password.val,
        };

        this.$store.dispatch("auth/uploadData", {
          data: fromData,
          mode: "login",
        });
      }
    },
    validateForm() {
      const formValidation = {
        mode: null,
        state: false,
      };
      if (this.validateEmail() && this.validatePassword()) {
        if (this.policyChecked) {
          return true;
        } else {
          formValidation.mode = "policy";
        }
      } else {
        this.formIsValid = false;
        formValidation.mode = "format";
      }
      this.formIsValid = formValidation;
      return false;
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
  },
};
</script>

<style lang="scss" scoped>
@include form-msg();
.icon {
  width: 6rem;
  height: 6rem;
  position: absolute;
  z-index: $z-middle;
  top: -2rem;
  left: -2rem;
}
.card {
  position: relative;
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
      letter-spacing: 0.6rem;
      font-size: 3rem;
    }
    .sub-title {
      color: $text-secondary-color;
    }
  }
  .login-box {
    flex: 1 1 75%;
    @include flex-box(column);

    .policy-box {
      flex: 0 1 3%;
      padding: 0 5.2rem;
      span {
        color: $text-secondary-color;
        font-size: 1.2rem;

        &.policy-link {
          padding-left: 0.2rem;
          display: inline-block;
          color: $secondary-color;
          transition: transform 0.2s ease-out;

          &:hover {
            color: $secondary-color-dark;
            transform: scale(1.05);
          }
        }
      }
    }
    .input-box {
      flex: 1 1 33%;
      padding: 1.3rem 5rem;
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
      .error-msg {
        color: $red;
        padding-top: 0.2rem;
        padding-left: 1rem;
      }
    }
    .link-box {
      flex: 1 1 10%;
      padding-right: 5rem;

      align-self: flex-end;
      display: flex;
      align-items: center;
      user-select: none;
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
  }

  .signup-box {
    flex: 0 1 9%;
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

<style lang="scss">
.card {
  .el-dialog {
    --el-color-primary: #{$secondary-color};
    .el-dialog__footer {
      @include flex-box(row);
      justify-content: end;
      .dialog-footer {
        @include flex-box(row);
        gap: 1rem;

        button {
          border-radius: 1.5rem;
          &.check {
            background-color: $third-color;
            &:hover {
              background-color: $third-color-dark;
            }
          }
        }
      }
    }
  }
}
.policy-box {
  .el-checkbox {
    --el-color-primary: #{$secondary-color};
  }
}
</style>
