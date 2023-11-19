<template>
  <div v-loading="loading" class="detail-wrapper">
    <div class="detail-box" v-if="showContent && showInteractionInfo">
      <div class="post-box">
        <div class="other-box">
          <div class="title-box">
            <span class="title">{{ title }}</span>
          </div>
          <div class="tags-box">
            <el-tag
              class="tag"
              v-for="tag in tags"
              :key="tag"
              :disable-transitions="false"
            >
              #{{ tag }}
            </el-tag>
          </div>
          <div class="data-box">
            <div class="interaction-box">
              <div class="box">
                <SvgIcon iconName="like" class="icon"> </SvgIcon>
                <span class="number"> {{ interactionInfo.links }}</span>
              </div>
              <div class="box">
                <SvgIcon iconName="comment" class="icon"> </SvgIcon>
                <span class="number">{{ interactionInfo.comments }}</span>
              </div>
              <div class="box">
                <SvgIcon iconName="forward" class="icon"> </SvgIcon>
                <span class="number">{{ interactionInfo.forwards }}</span>
              </div>
            </div>
            <div class="time-box">
              <span class="time">{{ scheduled_day }}</span>
              <span class="time">{{ scheduled_time }}</span>
              <el-tag :type="publish_state.type" class="publish_state">{{
                publish_state.state
              }}</el-tag>
            </div>
          </div>
        </div>
        <div class="content-box">
          <div class="preview markdown-body" v-html="renderedHtml"></div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="accounts-box">
        <div v-for="account in accountsInfo" class="account-card">
          <div class="icon-box">
            <SvgIcon :iconName="account.platform" class="icon"></SvgIcon>
          </div>
          <div class="content-box">
            <span class="name">{{ account.account_name }}</span>
            <span class="time-box">
              <span class="time">{{ account.publish_time.split(" ")[0] }}</span>
              <span class="time">{{ account.publish_time.split(" ")[1] }}</span>
            </span>

            <div class="link-box">
              <a class="link" :href="account.link" target="_blank">Post URL</a>
              <el-tag
                :type="tagType[account.state]"
                class="state"
                size="small"
                >{{ stateWords[account.state] }}</el-tag
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
export default {
  data() {
    return {
      showContent: false,
      showInteractionInfo: false,
      tagType: ["warning", "danger", "success"],
      stateWords: ["Draft", "Failure", "Success"],
      md: new MarkdownIt("commonmark", {
        html: true,
        linkify: true,
        typographer: true,
      }),
    };
  },
  computed: {
    interactionInfo() {
      return this.$store.getters["publish/interactionInfo"];
    },

    detailInfo() {
      return this.$store.getters["publish/detailInfo"];
    },

    accountsInfo() {
      return this.detailInfo.accounts;
    },
    renderedHtml() {
      return this.md.render(this.detailInfo.content);
    },
    tags() {
      return this.detailInfo.topics;
    },
    title() {
      return this.detailInfo.title;
    },
    scheduled_day() {
      return this.detailInfo.scheduled_time.split(" ")[0];
    },
    scheduled_time() {
      return this.detailInfo.scheduled_time.split(" ")[1];
    },
    publish_state() {
      let state = null;
      let type = null;
      switch (this.detailInfo.state) {
        case 0:
          state = "Draft";
          type = "warning";
          break;
        case 1:
          state = "Failure";
          type = "danger";
          break;
        case 2:
          state = "Success";
          type = "success";
          break;
      }
      return {
        state: state,
        type: type,
      };
    },
    interactionLoading() {
      return this.$store.getters["publish/interactionLoading"];
    },

    loading() {
      return this.$store.getters["publish/detailLoading"];
    },
  },
  watch: {
    detailInfo(newVal) {
      if (newVal) {
        this.showContent = true;
      }
    },
    interactionInfo(newVal) {
      if (newVal) {
        this.showInteractionInfo = true;
      }
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "github-markdown-css/github-markdown.css";
.detail-wrapper {
  height: 100%;
  max-height: 100%;

  .detail-box {
    // padding: ;
    height: 100%;
    max-height: 100%;
    overflow: visible;
    @include flex-box(row);
    gap: 1rem;

    .post-box {
      flex: 1 0 auto;
      max-width: 80%;
      height: 100%;
      gap: 1rem;
      //   border: 1px solid red;
      @include flex-box(column);

      .other-box {
        flex: 0 1 auto;
        @include flex-box(column);
        // gap: 0rem;

        .title-box {
          //   flex: 0 1 30%;
          margin-bottom: 1rem;
          @include flex-center();
          .title {
            color: $secondary-color-dark;
            font-size: 2.4rem;
            font-weight: $font-weight-bold;
          }
        }

        .data-box {
          user-select: none;
          @include flex-box(row);
          align-items: center;
          justify-content: space-between;
          .interaction-box {
            // border: 1px solid red;
            flex: 0 1 20%;
            @include flex-box(row);
            align-items: center;

            gap: 1.5rem;

            .box {
              @include flex-box(row);
              gap: 0.2rem;
              .icon {
                @include icon-style(
                  calc($icon-size-small - 0.5rem),
                  $third-color
                );
              }
              .number {
                font-size: 1.6rem;
                color: $secondary-color;
                @include flex-box(row);
                align-items: center;
              }
            }
          }

          .time-box {
            //   border: 1px solid red;
            flex: 0 1 30%;
            @include flex-box(row);
            align-items: center;
            justify-content: end;
            gap: 1rem;

            .time {
              background-color: $secondary-color-dark;
              color: $third-color-light;
              padding: 0.3rem 0.5rem;
              border-radius: 0.8rem;
            }
          }
        }
        .tags-box {
          flex: 1 0 auto;
          //   border: 1px solid red;
          flex-wrap: wrap; /* 当子元素超出容器宽度时换行 */
          @include flex-box(row);
          justify-content: center;
          align-items: center;
          gap: 0.8rem;

          .tag {
            user-select: none;
            // border: 0.2rem solid #000;
          }
        }
      }
      .content-box {
        // border: 1px solid red;
        // max-height: 70%;
        flex-grow: 1;
        @include flex-box(column);
        overflow: hidden;
        .preview {
          overflow: auto;
          flex-grow: 1;
          padding-left: 1.3rem;
          padding-top: 0.6rem;
          background-color: $background-color-white;
          border-radius: 0.8rem;
          box-shadow: inset 0.2rem 0.2rem 0.5rem rgba($secondary-color, 0.3),
            inset -0.2rem -0.2rem 0.5rem rgba($background-color-gray, 1);
        }
      }
    }
    .divider {
      width: 0.8rem;
      background-color: rgba($secondary-color, 0.4);
      margin: 2rem 0;
      border-radius: 5rem;
    }
    .accounts-box {
      flex: 0 1 30%;
      padding-top: 2rem;
      //   border: 1px solid red;

      @include flex-box(column);
      gap: 1rem;
      align-items: center;

      .account-card {
        user-select: none;
        background-color: $background-color-white;
        border-radius: 1rem;
        width: fit-content;
        padding: 0.6rem 2rem 0.6rem 0.8rem;

        gap: 0.6rem;
        @include flex-box(row);
        transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

        &:hover {
          transform: scaleY(1.05) scaleX(1.02);
          box-shadow: 0.2rem 0.2rem 0.4rem 0rem rgba(0, 0, 0, 0.2);
        }
        .icon-box {
          @include flex-center();
          .icon {
            @include icon-style($icon-size-large, $secondary-color);
          }
        }
        .content-box {
          @include flex-box(column);
          gap: 0.4rem;

          .name {
            // @include flex-center();
            color: $secondary-color;
            font-size: 1.5rem;
            font-weight: $font-weight-bold;
          }
          .time-box {
            @include flex-box(row);
            gap: 0.4rem;
            .time {
              font-size: 1.2rem;
              background-color: $secondary-color-dark;
              color: $third-color-light;
              padding: 0.3rem 0.5rem;
              border-radius: 0.8rem;
            }
          }
          .link-box {
            @include flex-box(row);
            align-items: center;
            gap: 0.6rem;

            .link {
              color: $third-color;
              text-decoration: none;
              font-size: 1.3rem;
              // font-weight: $font-weight-bold;
              transition: color 0.2s ease-out;

              /* 鼠标悬停样式 */
              &:hover {
                color: $third-color-dark;
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.el-dialog.detail-panel-card {
  .el-dialog__body {
    .el-loading-mask {
      background-color: rgba($background-color-gray, 0.8);
    }
    .detail-box {
      .post-box {
        .time-box {
          .el-tag {
            .el-tag__content {
              //   font-weight: $font-weight-bold;
            }
          }
        }
        .tags-box {
          .el-tag {
            --el-tag-bg-color: #{$secondary-color-dark};
            --el-tag-border-color: #{$secondary-color};
            --el-tag-hover-color: #{$primary-color};
            --el-tag-text-color: #{$primary-color};
            .el-icon {
              &:hover {
                color: $secondary-color;
              }
            }
          }
          .input-box {
            .el-button {
              --el-button-hover-bg-color: #{$secondary-color-dark};
              --el-button-border-color: #{rgba($secondary-color, 0.3)};
              --el-button-hover-text-color: #{$primary-color};
              --el-button-hover-border-color: #{$secondary-color};
            }
          }
        }
      }
    }
  }
}
</style>
