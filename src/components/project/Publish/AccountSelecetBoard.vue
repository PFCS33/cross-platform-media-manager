<template>
  <el-dialog
    class="account-panel"
    destroy-on-close
    v-model="showAccountPanel"
    :show-close="false"
  >
    <template #header>
      <h1 class="title">CHOOSE YOUR ACCOUNTS</h1>
    </template>
    <div class="content">
      <div class="select-box">
        <div class="platform-box">
          <div
            @click="selectedPlatform = 'weibo'"
            :class="[
              'platform-card',
              { selected: selectedPlatform === 'weibo' },
            ]"
          >
            <SvgIcon class="icon" iconName="weibo"></SvgIcon>
          </div>

          <div
            @click="selectedPlatform = 'x'"
            :class="['platform-card', { selected: selectedPlatform === 'x' }]"
          >
            <SvgIcon class="icon" iconName="x"></SvgIcon>
          </div>
          <div
            @click="selectedPlatform = 'facebook'"
            :class="[
              'platform-card',
              { selected: selectedPlatform === 'facebook' },
            ]"
          >
            <SvgIcon class="icon" iconName="facebook"></SvgIcon>
          </div>
          <div
            @click="selectedPlatform = 'wordpress'"
            :class="[
              'platform-card',
              { selected: selectedPlatform === 'wordpress' },
            ]"
          >
            <SvgIcon class="icon" iconName="wordpress"></SvgIcon>
          </div>
        </div>
        <div class="divider"></div>
        <transition-group name="list" tag="div" class="card-box">
          <div
            v-for="account in unSelectedAccounts"
            :key="account.id"
            class="account-card-wrapper"
          >
            <div class="account-card">
              <svgIcon :iconName="account.platform" class="icon"></svgIcon>
              <span class="username">@ {{ account.name }}</span>
              <div class="flex-div"></div>
              <el-checkbox
                :model-value="false"
                @update:modelValue="addSelectedAccount(account)"
              ></el-checkbox>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="selected-box">
        <transition-group name="list" tag="div" class="card-box">
          <div
            v-for="account in selectedAccounts"
            :key="account.id"
            class="account-card-wrapper"
          >
            <div class="account-card">
              <svgIcon :iconName="account.platform" class="icon"></svgIcon>
              <span class="username">@ {{ account.name }}</span>
              <div class="flex-div"></div>
              <el-checkbox
                :model-value="true"
                @update:modelValue="deleteSelectedAccount(account)"
              ></el-checkbox>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <template #footer>
      <div class="btn-box">
        <BaseButton class="btn" @click="showAccountPanel = false"
          >Back</BaseButton
        >
        <BaseButton class="btn confirm">Confirm</BaseButton>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      showAccountPanel: false,
      selectedPlatform: "weibo",
      selectedAccounts: [],
    };
  },
  watch: {},
  computed: {
    accountInfo() {
      return this.$store.getters["platform/accountInfo"];
    },
    displayedAccounts() {
      const platform = this.selectedPlatform;
      const totalAccounts = this.accountInfo;
      const accounts = [];
      if (totalAccounts) {
        if (totalAccounts.has(platform)) {
          totalAccounts.get(platform).forEach((info) => {
            accounts.push(info);
          });
        }
      }

      return accounts.filter((info) => info.isLogin);
    },
    unSelectedAccounts() {
      const selectedIds = this.selectedAccounts.map((info) => info.id);
      return this.displayedAccounts.filter(
        (info) => !selectedIds.includes(info.id)
      );
    },
  },
  methods: {
    addSelectedAccount(value) {
      const index = this.unSelectedAccounts.findIndex(
        (info) => info.id === value.id
      );

      this.selectedAccounts.push(value);
    },
    deleteSelectedAccount(value) {
      const index = this.selectedAccounts.findIndex(
        (info) => info.id === value.id
      );

      this.selectedAccounts.splice(index, 1); // 如果找到，则移除
    },
  },
};
</script>

<style lang="scss" scoped>
@include list-animation();
.account-panel {
  .content {
    height: 100%;
    @include flex-box(row);
    align-items: center;
    gap: 2rem;
    justify-content: center;
    .select-box {
      height: 100%;
      //   border: 1px solid #fff;
      border-radius: 1rem;

      flex: 0 1 60%;
      background-color: $secondary-color;

      @include flex-box(row);
      .platform-box {
        margin: 2rem 0;
        flex: 0 1 15%;
        @include flex-box(column);
        align-items: center;
        // border: 0.2rem solid $background-color-gray;
        border-radius: 1rem;
        gap: 1rem;
        .platform-card {
          @include platform-card();
          background-color: $secondary-color-dark;
          .icon {
            @include icon-style(
              calc($icon-size-large + 1.2rem),
              $background-color-gray
            );
            transition: fill 0.2s ease-out;
            cursor: pointer;
            &:hover {
              fill: $primary-color;
            }
          }
        }
        // gap: 1rem;
      }

      .divider {
        width: 0.5rem;
        background-color: rgba($secondary-color-dark, 0.6);
        margin: 2rem 0;
        border-radius: 5rem;
      }
      .card-box {
        overflow: auto;
        padding: 2rem;
        flex-grow: 1;
        @include flex-box(column);
        gap: 1rem;
        .account-card-wrapper {
          .account-card {
            width: 30rem;
            background-color: $secondary-color-dark;
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
              @include icon-style(
                calc($icon-size-large + 1.2rem),
                $primary-color
              );
              transition: fill 0.2s ease-out;
            }
            .flex-div {
              flex: 1 1 0;
            }
            .username {
              font-size: 1.5rem;
              color: $background-color-gray;
            }
          }
        }
      }
    }

    .selected-box {
      overflow: auto;
      height: 100%;

      flex: 0 1 30%;

      background-color: $background-color-white;
      border-radius: 0.8rem;
      box-shadow: inset 0.2rem 0.2rem 0.5rem rgba($secondary-color, 0.3),
        inset -0.2rem -0.2rem 0.5rem rgba($background-color-gray, 1);

      .card-box {
        @include flex-box(column);
        padding: 2rem;
        gap: 1rem;
        align-items: center;
        .account-card-wrapper {
          .account-card {
            width: 20rem;
            background-color: $secondary-color-dark;
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
              @include icon-style(
                calc($icon-size-large + 1.2rem),
                $primary-color
              );
              transition: fill 0.2s ease-out;
            }
            .flex-div {
              flex: 1 1 0;
            }
            .username {
              font-size: 1.5rem;
              color: $background-color-gray;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-dialog.account-panel {
  margin-top: 0.8%;

  width: 70%;
  height: 90%;
  background-color: $secondary-color-dark;

  @include flex-box(column);
  justify-content: space-between;
  padding-top: 1.5rem;
  padding-bottom: 1rem;

  .el-dialog__header {
    // flex: 0 1 10%;
    margin-right: 0;
    padding: 0;
    margin-left: 2rem;
    // padding: 1.8rem;
    // margin-bottom: 0.6rem;
    .title {
      color: $background-color;
    }
  }

  .el-dialog__body {
    padding: 0;
    flex-grow: 1;
  }
  .el-dialog__footer {
    padding: 0;
    margin-right: 2rem;
    .btn-box {
      @include flex-box(row);
      justify-content: end;
      gap: 1rem;

      .btn {
        border-radius: 0.8rem;

        &.cancle {
        }
        &.confirm {
          background-color: $third-color;
          &:hover {
            background-color: $third-color-dark;
          }
        }
      }
    }
  }
}
</style>
