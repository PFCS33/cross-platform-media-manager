<template>
  <div class="box" v-loading="loading">
    <div class="toolbox">
      <div
        @click="changeSelectedPlatform('overview')"
        :class="[
          'inner-box',
          'overview-box',
          { selected: selectedPlatform === 'overview' },
        ]"
      >
        <svgIcon iconName="overview" class="icon"></svgIcon>
        <span class="text">Overview</span>
      </div>
      <div
        @click="changeSelectedPlatform('weibo')"
        :class="[
          'inner-box',
          'weibo-box',
          { selected: selectedPlatform === 'weibo' },
        ]"
      >
        <svgIcon iconName="weibo" class="icon"></svgIcon>
        <span class="text">Weibo</span>
      </div>
      <div
        @click="changeSelectedPlatform('x')"
        :class="[
          'inner-box',
          'x-box',
          {
            selected: selectedPlatform === 'x',
          },
        ]"
      >
        <svgIcon iconName="x" class="icon"></svgIcon>
        <span class="text">X</span>
      </div>
      <div
        @click="changeSelectedPlatform('facebook')"
        :class="[
          'inner-box',
          'facebook-box',
          { selected: selectedPlatform === 'facebook' },
        ]"
      >
        <svgIcon iconName="facebook" class="icon"></svgIcon>
        <span class="text">Facebook</span>
      </div>
      <div
        @click="changeSelectedPlatform('wordpress')"
        :class="[
          'inner-box',
          'ins-box',
          { selected: selectedPlatform === 'wordpress' },
        ]"
      >
        <svgIcon iconName="wordpress" class="icon"></svgIcon>
        <span class="text">WordPress</span>
      </div>
    </div>
    <div class="content">
      <div class="loggedBox">
        <div class="box-title">Logged</div>
        <transition-group name="list" tag="div" class="info-list">
          <div
            class="info-content-wrapper"
            v-for="info in loggedAccounts"
            :key="info.platform + info.username"
          >
            <div class="account-info-card">
              <svgIcon :iconName="info.platform" class="icon"></svgIcon>
              <span class="username">@ {{ info.username }}</span>
              <div class="flex-div"></div>
              <BaseButton class="button backward" @click="logoutAccount(info)"
                >Logout</BaseButton
              >
            </div>
          </div>
        </transition-group>
      </div>
      <div class="divider"></div>
      <div class="unloggedBox">
        <div class="box-title">Unlogged</div>
        <transition-group name="list" tag="div" class="info-list">
          <div
            class="info-content-wrapper"
            v-for="info in unLoggedAccounts"
            :key="info.platform + info.username"
          >
            <div class="account-info-card">
              <svgIcon :iconName="info.platform" class="icon"></svgIcon>
              <span class="username">{{ info.username }}</span>
              <div class="flex-div"></div>
              <div class="button-box">
                <BaseButton class="button forward">Login</BaseButton>
                <BaseButton
                  class="button backward"
                  @click="confirmAccountDelete"
                  >Delete</BaseButton
                >
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    <div class="login-btn">
      <SvgIcon iconName="add" class="icon" @click="openAuthDialog"></SvgIcon>
    </div>
    <el-dialog
      v-model="dialogFormVisible"
      title="Get Authorization"
      :show-close="false"
      class="platform"
    >
      <div class="form">
        <span>Select a Platform</span>
        <el-select v-model="platformAdded" placeholder="Platform">
          <el-option
            v-for="platform in platforms"
            :key="platform"
            :label="capitalizeFirstLetter(platform)"
            :value="platform"
          >
            <SvgIcon :iconName="platform" class="icon"></SvgIcon>
            <span>{{ capitalizeFirstLetter(platform) }}</span>
          </el-option>
        </el-select>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <BaseButton class="button confirm" @click="submitAuthRequest">
            Confirm
          </BaseButton>
          <BaseButton class="button cancle" @click="dialogFormVisible = false"
            >Cancel</BaseButton
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="deleteDialogVisible"
      title="Are you sure to delete this account?"
      :show-close="false"
      class="platform"
    >
      <template #footer>
        <span class="dialog-footer">
          <BaseButton class="button confirm" @click="deleteAccount">
            Confirm
          </BaseButton>
          <BaseButton class="button cancle" @click="deleteDialogVisible = false"
            >Cancel</BaseButton
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      selectedPlatform: "overview",
      dialogFormVisible: false,
      platforms: ["weibo", "x", "facebook", "wordpress"],
      platformAdded: null,
      deleteDialogVisible: false,
    };
  },

  computed: {
    loading() {
      return this.$store.getters["platform/loading"];
    },

    error() {
      return this.$store.getters["platform/error"];
    },
    displayedAccounts() {
      const platform = this.selectedPlatform;
      const totalAccounts = this.$store.getters["platform/accountInfo"];
      const accounts = [];
      if (totalAccounts) {
        if (platform === "overview") {
          for (const info of totalAccounts.values()) {
            accounts.push(...info);
          }
        } else {
          if (totalAccounts.has(platform)) {
            totalAccounts.get(platform).forEach((info) => {
              accounts.push(info);
            });
          }
        }
      }
      return accounts;
    },
    loggedAccounts() {
      return this.displayedAccounts.filter((info) => info.isLogin);
    },
    unLoggedAccounts() {
      return this.displayedAccounts.filter((info) => !info.isLogin);
    },
  },
  watch: {
    error(newVal) {
      if (newVal.state) {
        ElMessage.error(`Error: ${newVal.message}`);
        setTimeout(() => ElMessage.error("Please try again"), 500);
      } else {
        ElMessage.success(`${newVal.message}`);
      }
    },
  },
  methods: {
    deleteAccount() {
      ElMessage.success("delete account successfully");
    },
    confirmAccountDelete() {
      this.deleteDialogVisible = true;
    },
    logoutAccount(info) {
      info.isLogin = false;
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    changeSelectedPlatform(platform) {
      this.selectedPlatform = platform;
    },

    openAuthDialog() {
      this.dialogFormVisible = true;
    },
    submitAuthRequest() {
      const platform = this.platformAdded;

      if (!platform) {
        ElMessage.warning("please select a platform");
      } else {
        this.dialogFormVisible = false;
        // 重定向到对应社交媒体的授权页面
        let authURL = null;
        switch (platform) {
          case "weibo":
            authURL =
              "https://api.weibo.com/oauth2/authorize?client_id=1954849401&redirect_uri=https://api.weibo.com/oauth2/default.html&response_type=code";
            break;
          case "x":
            break;
          case "facebook":
            break;
          case "wordpress":
            break;
        }

        const oauthWindow = window.open(authURL, "_blank");
        window.addEventListener("message", (event) => {
          if (event.origin !== "http://localhost:5173") return;
          else {
            if (event.data.status === "success") {
              // 向 server 发送 code
              this.$store.dispatch("platform/postAuthCode", {
                code: event.data.code,
                platform: platform,
              });
            }
          }
        });
      }
    },
  },
  mounted() {
    this.$store.dispatch("platform/getAccountInfo");
  },
};
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  @include container-base();
  @include flex-box(row);
  padding: 2rem 3rem;
  gap: 1.2rem;

  .toolbox {
    // box-shadow: 0.2rem 0.2rem 0.3rem 0.2rem rgba($secondary-color, 0.3) inset;
    // border-radius: 1rem;
    // padding: 0rem 1rem;

    width: $icon-size-large + 1rem * 9;
    user-select: none;
    @include flex-box(column);
    justify-content: start;
    gap: 1rem;
    padding-top: 1rem;

    .inner-box {
      @include flex-box(row);
      align-items: center;
      gap: 0.8rem;

      background-color: $secondary-color;
      padding: 0.5rem;
      border-radius: 1.2rem;
      box-shadow: 0.15rem 0.3rem 0.2rem 0rem rgba(0, 0, 0, 0.26);
      transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out;
      .icon {
        @include icon-style($icon-size-large);
        transition: fill 0.2s ease-out;
      }

      .text {
        font-size: 1.4rem;
        transition: color 0.2s ease-out;
        color: $icon-color-gray;
      }
      &:hover {
        cursor: pointer;
        background-color: $secondary-color-dark;
        .icon {
          fill: $primary-color;
        }
        .text {
          color: $primary-color;
        }
      }

      &.selected {
        background-color: $secondary-color-dark;
        box-shadow: inset 0.3rem 0.3rem 0.5rem 0.4rem rgba(0, 0, 0, 0.423);
        .icon {
          fill: $primary-color;
        }
        .text {
          color: $primary-color;
        }
      }
    }
  }

  .content {
    flex: 1 1 0;

    // border: 0.3rem rgba($secondary-color, 0.8) solid;
    // box-shadow: 0rem 0rem 0rem 0.3rem rgba($secondary-color, 0.3);
    // background-color: $background-color;

    border-radius: 2.5rem;
    gap: 1rem;

    @include flex-box(row);

    .loggedBox,
    .unloggedBox {
      // background-color: rgba($secondary-color, 0.8);
      border-radius: 2.5rem;
      @include flex-box(column);
      flex: 1 1 0;
      padding: 0 3rem;
      padding-top: 1.2rem;
      gap: 1.2rem;

      .box-title {
        text-transform: uppercase;
        font-weight: $font-weight-bold;
        text-align: center;
        color: $secondary-color;
        font-size: 2rem;
        position: relative;
        margin-bottom: 1rem;

        &:after {
          content: "";
          position: absolute;
          bottom: -0.7rem;
          left: 0;
          right: 0;
          height: 0.15rem;
          background-color: rgba($secondary-color, 0.3);
          // background-color: rgba($border-color-gray, 0.3);
          border-radius: 5rem;
        }
      }
      .info-list {
        // @include flex-box(column);
        // gap: 1.2rem;
        position: relative;
        .info-content-wrapper {
          width: 100%;
          margin-top: 1.2rem;
          .account-info-card {
            width: 100%;

            background-color: $background-color;
            @include flex-box(row);
            // border: 0.2rem solid rgba($secondary-color, 0.5);
            border-radius: 1rem;
            padding: 0.8rem 1rem;
            align-items: center;
            gap: 1rem;
            transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

            &:hover {
              transform: scaleY(1.05) scaleX(1.02);
              box-shadow: 0.2rem 0.2rem 0.4rem 0rem rgba(0, 0, 0, 0.2);
            }

            .icon {
              transition: fill 0.2s ease-out;
            }
            .flex-div {
              flex: 1 1 0;
            }
            .username {
              font-size: 1.5rem;
            }

            .button {
              border-radius: 1.5rem;

              &.forward {
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
    .loggedBox {
      .icon {
        @include icon-style($icon-size-large, $secondary-color);
      }
    }
    .unloggedBox {
      .icon {
        @include icon-style($icon-size-large, rgba($secondary-color, 0.3));
      }
      .button-box {
        @include flex-box(row);
        gap: 1rem;
      }
    }
    .divider {
      width: 0.5rem;
      background-color: rgba($secondary-color, 0.6);
      margin: 2rem 0;

      border-radius: 5rem;
    }
  }

  .login-btn {
    position: absolute;
    bottom: 3%;
    right: 2%;
    .icon {
      @include icon-style($icon-size-large, $third-color);
      transition: fill 0.2s ease-out;
      cursor: pointer;
      &:hover {
        fill: $third-color-dark;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@include list-animation();
</style>

<style lang="scss">
.box {
  .el-loading-mask {
    border-radius: 2.5rem;
    background-color: rgba(#fff, 0.7);
  }
}

.el-dialog.platform {
  width: 30%;
  background-color: $secondary-color-dark;
  --el-color-primary: #{$primary-color};
  border-radius: 1rem;
  .el-dialog__header {
    user-select: none;
    .el-dialog__title {
      color: $background-color;
    }
  }
  .el-dialog__body {
    padding-top: 1.8rem;
    padding-bottom: 3rem;

    .form {
      @include flex-box(column);
      gap: 1rem;
      width: 98%;

      span {
        font-size: 1.3rem;
        color: $background-color-gray;
      }
    }
  }
  .dialog-footer {
    @include flex-box(row);
    justify-content: flex-end;
    gap: 1rem;
    .button {
      border-radius: 2rem;
    }
    .confirm {
      background-color: $third-color;
      &:hover {
        background-color: $third-color-dark;
      }
    }
    .cancle {
    }
  }
}
.el-select-dropdown {
  --el-color-primary: #{$primary-color};
  background-color: $secondary-color;
  .el-select-dropdown__item {
    background-color: $secondary-color;
    color: $icon-color-gray;
    @include flex-box(row);
    align-items: center;
    gap: 0.8rem;
    transition: background-color 0.1s ease-out, color 0.1s ease-out,
      fill 0.1s ease-out;
    .icon {
      @include icon-style($icon-size-small);
      align-items: center;
    }

    &.hover,
    &.selected {
      background-color: $secondary-color-dark;
      color: $primary-color;
      .icon {
        fill: $primary-color;
      }
    }
  }
}
</style>
