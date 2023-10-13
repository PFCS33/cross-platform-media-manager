<template>
  <div class="box">
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
      </div>
      <div
        @click="changeSelectedPlatform('instogram')"
        :class="[
          'inner-box',
          'ins-box',
          { selected: selectedPlatform === 'instogram' },
        ]"
      >
        <svgIcon iconName="instogram" class="icon"></svgIcon>
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
              <BaseButton class="button">Logout</BaseButton>
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
                <BaseButton class="button">Login</BaseButton>
                <BaseButton class="button">Delete</BaseButton>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "../ui/BaseButton.vue";

export default {
  data() {
    return {
      selectedPlatform: "overview",
    };
  },
  computed: {
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
  methods: {
    changeSelectedPlatform(platform) {
      this.selectedPlatform = platform;
    },

    redirectToWeibo() {
      const authURL =
        "https://api.weibo.com/oauth2/authorize?client_id=1954849401&redirect_uri=https://api.weibo.com/oauth2/default.html&response_type=code";
      window.location.href = authURL;
    },
  },
  mounted() {
    this.$store.dispatch("platform/getAccountInfo");
  },
  components: { BaseButton },
};
</script>

<style lang="scss" scoped>
.box {
  @include container-base();
  @include flex-box(row);
  padding: 2rem 3rem;
  gap: 1.2rem;

  .toolbox {
    // box-shadow: 0.2rem 0.2rem 0.3rem 0.2rem rgba($secondary-color, 0.3) inset;
    // border-radius: 1rem;
    // padding: 0rem 1rem;

    width: 10rem;

    @include flex-box(column);
    justify-content: start;
    gap: 1rem;
    padding-top: 1rem;
    .icon {
      @include icon-style($icon-size-large);
      transition: fill 0.2s ease-out;
    }
    .inner-box {
      background-color: $secondary-color;
      padding: 0.5rem;
      border-radius: 1.2rem;
      box-shadow: 0.15rem 0.3rem 0.2rem 0rem rgba(0, 0, 0, 0.26);
      transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out;

      &:hover {
        cursor: pointer;
        background-color: $secondary-color-dark;
        .icon {
          fill: $primary-color;
        }
      }

      &.selected {
        background-color: $secondary-color-dark;
        box-shadow: inset 0.3rem 0.3rem 0.5rem 0.4rem rgba(0, 0, 0, 0.423);
        .icon {
          fill: $primary-color;
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
              box-shadow: 0.2rem 0.1rem 0.5rem rgba(0, 0, 0, 0.2);
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
            }
          }
        }
      }
    }
    .loggedBox {
      .icon {
        @include icon-style($icon-size-large, $secondary-color-dark);
      }
    }
    .unloggedBox {
      .icon {
        @include icon-style($icon-size-large, rgba($secondary-color, 0.6));
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
}
</style>

<style lang="scss" scoped>
@include list-animation();
</style>
