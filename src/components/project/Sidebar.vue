<template>
  <div :class="['sidebar', { expand: sidebarExpandedFlag }]">
    <div class="avatar-box">
      <div class="user-info">
        <img :src="avatar" class="avatar" />
        <span class="username">{{ userName }}</span>
      </div>

      <div class="menu-toggle-wrapper">
        <div class="arrow-wrapper">
          <svg
            class="arrow-icon"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            @click="toggleSidebarExpand"
          >
            <path
              d="M544 522.666667c0-8.533333-4.266667-17.066667-10.666667-23.466667L192 189.866667c-12.8-12.8-34.133333-10.666667-44.8 2.133333-12.8 12.8-10.666667 34.133333 2.133333 44.8l315.733334 285.866667L149.333333 808.533333c-12.8 12.8-14.933333 32-2.133333 44.8 6.4 6.4 14.933333 10.666667 23.466667 10.666667 8.533333 0 14.933333-2.133333 21.333333-8.533333l341.333333-309.333334c6.4-6.4 10.666667-14.933333 10.666667-23.466666z"
            ></path>
            <path
              d="M864 499.2l-341.333333-309.333333c-12.8-12.8-34.133333-10.666667-44.8 2.133333-12.8 12.8-10.666667 34.133333 2.133333 44.8l315.733333 285.866667-315.733333 285.866666c-12.8 12.8-14.933333 32-2.133333 44.8 6.4 6.4 14.933333 10.666667 23.466666 10.666667 8.533333 0 14.933333-2.133333 21.333334-8.533333l341.333333-309.333334c6.4-6.4 10.666667-14.933333 10.666667-23.466666 0-8.533333-4.266667-17.066667-10.666667-23.466667z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <span class="title-text">menu</span>
    <div class="menu-box">
      <router-link class="menu-item" :to="{ name: 'home' }">
        <SvgIcon iconName="home" class="icon"></SvgIcon>
        <span class="menu-text">Home</span>
      </router-link>
      <router-link class="menu-item" :to="{ name: 'platform' }">
        <SvgIcon iconName="platform" class="icon"></SvgIcon>
        <span class="menu-text">Platform</span>
      </router-link>
      <router-link class="menu-item" :to="{ name: 'publish' }">
        <SvgIcon iconName="publish" class="icon"></SvgIcon>
        <span class="menu-text">Plan</span>
      </router-link>
      <router-link class="menu-item" :to="{ name: 'draft' }">
        <SvgIcon iconName="draft" class="icon"></SvgIcon>
        <span class="menu-text">Draft</span>
      </router-link>
      <router-link class="menu-item" :to="{ name: 'history' }">
        <SvgIcon iconName="history" class="icon"></SvgIcon>
        <span class="menu-text">History</span>
      </router-link>

      <router-link class="menu-item" :to="{ name: 'statistic' }">
        <SvgIcon iconName="statistic" class="icon"></SvgIcon>
        <span class="menu-text">Statistics</span>
      </router-link>
    </div>
    <div class="flex-box"></div>
    <div class="config-box">
      <router-link class="menu-item" :to="{ name: 'config' }">
        <SvgIcon iconName="config" class="icon"></SvgIcon>
        <span class="menu-text">Config</span>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    userName: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  data() {
    return {
      sidebarExpandedFlag: false,
    };
  },
  methods: {
    toggleSidebarExpand() {
      this.sidebarExpandedFlag = !this.sidebarExpandedFlag;
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  overflow: hidden;
  user-select: none;
  width: $icon-size-regular + 2rem;
  height: 100vh;
  padding: 3.5rem 1rem 2.5rem 1rem;
  @include flex-box(column);
  transition: width 0.2s ease-out;

  .avatar-box {
    @include flex-box(column);
    gap: 0.5rem;

    .user-info {
      @include flex-box(row);
      align-items: center;
      justify-content: start;
      gap: 1rem;
      .avatar {
        min-width: $avatar-size;
        width: $avatar-size;
        height: $avatar-size;
        border-radius: 0.8rem;
      }
      .username {
        font-size: 2.5rem;
        color: $third-color-light;
        opacity: 0;
        transition: opacity 0.2s ease-out;
      }
    }
    .menu-toggle-wrapper {
      @include flex-box(row);
      justify-content: flex-end;
      align-items: center;
      position: relative;
      top: 0;

      transition: top 0.2s ease-out;
      .arrow-wrapper {
        transition: transform 0.2s ease-out;
      }
      .arrow-icon {
        transition: transform 0.2s ease-out;
        @include icon-style($icon-size-small);

        align-self: center;
        &:hover {
          fill: $primary-color;
          transform: translateX(0.5rem);
        }
      }
    }
  }

  .menu-box,
  .config-box {
    @include flex-box(column);
    gap: 1.3rem;

    .menu-item {
      @include flex-box(row);
      text-decoration: none;
      gap: 1.3rem;
      align-items: center;
      justify-content: start;
      font-size: 1.4rem;

      .menu-text {
        color: $icon-color-gray;
        transition: transform 0.2s ease-out, color 0.2s ease-out;
      }
      .icon {
        @include icon-style();
        min-width: $icon-size-regular;
      }
      &:hover {
        .icon {
          fill: $primary-color;
          transform: scale(1.2);
        }
        .menu-text {
          color: $primary-color;
          transform: scale(1.1);
        }
      }
    }
  }

  .title-text {
    margin-top: 1rem;
    margin-bottom: 1.3rem;
    text-align: left;

    transition: opacity 0.2s ease-out;
    text-transform: uppercase;
    font-weight: $font-weight-bold;
    color: $text-secondary-color;
  }

  .title-text,
  .menu-text {
    opacity: 0;
  }
  .flex-box {
    flex: 1 1 0;
  }

  .icon,
  .arrow-icon {
    cursor: pointer;
    fill: $icon-color-gray;
    transition: transform 0.2s ease-out, fill 0.2s ease-out;
  }

  .router-link-active {
    .icon {
      fill: $primary-color !important;
      transform: scale(1.2);
    }
    .menu-text {
      color: $primary-color !important;
      transform: scale(1.1);
    }
  }

  &.expand {
    width: $sidebar-width;
    .avatar-box {
      .user-info {
        .username {
          opacity: 1;
        }
      }
      .menu-toggle-wrapper {
        position: relative;
        top: -$avatar-size - 0.25rem;

        .arrow-wrapper {
          transform: rotate(-180deg);
        }
      }
    }
    .title-text,
    .menu-text {
      opacity: 1;
    }
  }
}
</style>
