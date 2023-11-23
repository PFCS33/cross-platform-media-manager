<template>
  <div class="home-box">
    <div class="user-box">
      <BaseCard class="welcome-box">
        <div class="avatar-box">
          <img class="avatar" :src="userInfo.avatar" alt="avatar" />
        </div>
        <div class="slogan-box">
          <div class="name-box">
            <span class="title">Welcome back👋 </span>
            <span class="name">{{ userInfo.name }}</span>
          </div>
          <div class="subtitle">
            <div class="words">
              <span>Let's start to</span>
              <span class="strong">streamline</span>
              <span>your social media journey with</span>
            </div>
            <span class="brand">SyncWave</span>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="brand-box">
        <div class="img-box">
          <img class="brand" src="/public/logo.png" alt="brand" />
        </div>
      </BaseCard>
    </div>
    <div class="main-box">
      <BaseCard class="func-box">
        <div class="img-box">
          <SvgIcon class="icon" iconName="platform"></SvgIcon>
        </div>
        <div class="info-box">
          <div class="name-box">Platform Management</div>
          <div class="description-box">
            <p class="words">
              Centralize management of your social media platform accounts bound
              in SyncWave, including authorization, deauthorization, and account
              deletion. Currently supports platforms: Weibo, X, Facebook,
              WordPress
            </p>
          </div>
        </div>
      </BaseCard>
      <BaseCard class="func-box">
        <div class="img-box">
          <SvgIcon class="icon" iconName="publish"></SvgIcon>
        </div>
        <div class="info-box">
          <div class="name-box">Plan & Publish</div>
          <div class="description-box">
            <p class="words">
              Design and execute your content publishing plan in our customized
              calendar. Sync and publish to multiple platforms' accounts with
              one click, efficiently managing your publishing schedule
            </p>
          </div>
        </div>
      </BaseCard>
      <BaseCard class="func-box">
        <div class="img-box">
          <SvgIcon class="icon" iconName="draft"></SvgIcon>
        </div>
        <div class="info-box">
          <div class="name-box">Draft Box</div>
          <div class="description-box">
            <p class="words">
              Save and manage unpublished content. Easily edit and modify in the
              draft box, always ready to publish
            </p>
          </div>
        </div>
      </BaseCard>
      <BaseCard class="func-box">
        <div class="img-box">
          <SvgIcon iconName="history" class="icon"></SvgIcon>
        </div>
        <div class="info-box">
          <div class="name-box">Publish History</div>
          <div class="description-box">
            <p class="words">
              View and analyze your publishing history. Track the performance of
              each post to optimize future content strategies
            </p>
          </div>
        </div>
      </BaseCard>
      <BaseCard class="func-box">
        <div class="img-box">
          <SvgIcon iconName="statistic" class="icon"></SvgIcon>
        </div>
        <div class="info-box">
          <div class="name-box">Statistic Analysis</div>
          <div class="description-box">
            <p class="words">
              Dive deep into the analysis of your social media performance. Use
              detailed data reports to improve your marketing strategies
            </p>
          </div>
        </div>
      </BaseCard>
      <BaseCard class="func-box">
        <div class="img-box">
          <SvgIcon iconName="config" class="icon"></SvgIcon>
        </div>
        <div class="info-box">
          <div class="name-box">User Info Config</div>
          <div class="description-box">
            <p class="words">
              Customize your user configuration. Manage personal profiles and
              set preferences for the best user experience.
            </p>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    userInfo() {
      return this.$store.getters["auth/userInfo"];
    },
  },
};
</script>

<style lang="scss" scoped>
.home-box {
  @include container-base();
  @include flex-box(column);

  .user-box {
    margin-top: 2rem;
    padding: 0rem 4rem;
    user-select: none;
    // border: 1px solid red;
    flex: 0 1 28%;
    max-height: 30%;
    @include flex-box(row);
    // justify-content: space-between;
    gap: 3rem;

    .welcome-box {
      flex: 0 1 80%;
      @include flex-box(row);
      align-items: center;
      justify-content: start;
      padding: 0.6rem 3rem 0.6rem 2rem;

      gap: 2rem;
      background-color: $secondary-color-dark;
      border-radius: 1rem;

      .avatar-box {
        border: 0.6rem solid $background-color-gray;
        border-radius: 1.2rem;
        overflow: hidden;
        .avatar {
          width: 12rem;
          height: 12rem;
        }
      }
      .slogan-box {
        @include flex-box(column);
        gap: 2rem;

        .name-box {
          @include flex-box(row);
          align-items: end;
          .title {
            font-size: 4.3rem;
            color: $background-color;
          }
          .name {
            font-size: 3.2rem;
            color: $primary-color;
          }
        }

        .subtitle {
          @include flex-box(row);
          align-items: center;
          gap: 1rem;
          .words {
            // background-color: $background-color-gray;
            @include flex-box(row);
            gap: 0.6rem;
            font-size: 1.8rem;
            color: $background-color-gray;

            .strong {
              font-weight: $font-weight-bold;
            }
          }

          .brand {
            font-size: 3rem;
            color: $third-color-light;
            font-weight: $font-weight-bold;
            font-style: italic;
          }
        }
      }
    }

    .brand-box {
      //   border: 1px solid red;
      flex: auto;
      @include flex-center(row);
      border-radius: 1rem;
      background-color: $secondary-color-dark;

      &:hover {
        .img-box {
          border-color: $primary-color;
          box-shadow: 0.6rem 0.6rem 0.8rem 0rem rgba(#000, 0.4);
        }
      }

      .img-box {
        border: 0.6rem solid $background-color-gray;
        border-radius: 1.2rem;
        transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;
      }
      .brand {
        border-radius: 1.2rem;
        width: 15rem;
        height: 13rem;
      }
    }
  }
  .main-box {
    flex: auto;
    overflow: auto;
    // border: 1px solid red;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 2rem;
    align-items: center;
    justify-items: center;
    padding: 3rem 4rem;

    .func-box {
      width: 100%;
      height: 100%;
      padding: 1rem;
      user-select: none;
      //   border: 1px solid red;
      @include flex-box(row);
      background-color: $secondary-color;
      border-radius: 1rem;
      width: 55rem;
      gap: 1.2rem;
      transition: box-shadow 0.2s ease-out, transform 0.2s ease-out,
        background-color 0.2s ease-out;

      &:hover {
        transform: scaleX(1.04) scaleY(1.06);
        box-shadow: 0.4rem 0.4rem 0.4rem 0rem rgba($secondary-color-dark, 0.4);
        background-color: $secondary-color-dark;
      }

      .img-box {
        padding: 0 0.6rem;
        @include flex-center(row);
        border: 0.6rem solid $background-color-gray;
        border-radius: 1.2rem;
        .icon {
          @include icon-style(5rem, $primary-color);
        }
      }
      .info-box {
        // border: 1px solid red;
        flex: auto;
        overflow: auto;

        @include flex-box(column);
        gap: 0.8rem;

        .name-box {
          font-size: 2rem;
          //   color: $background-color;
          color: $third-color-light;
          font-weight: $font-weight-bold;
        }
        .description-box {
          .words {
            // flex-wrap: wrap;
            line-height: 1.2;
            font-size: 1.3rem;
            color: $background-color-gray;
            word-wrap: break-word;
            // padding: 1rem;
            padding-right: 3rem;
          }
        }
      }
    }
  }
}
</style>
