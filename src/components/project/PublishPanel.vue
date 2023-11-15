<template>
  <div class="panel-box">
    <div class="edit-box">
      <div class="other-box">
        <div class="title">
          <div class="form-item">
            <span class="label">Title</span>
            <el-input
              v-model="title"
              placeholder="Please input title"
              clearable
              class="input"
            />
          </div>
        </div>
        <div class="hashtags">
          <el-tag
            class="tag"
            v-for="tag in tags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleTagClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <div class="input-box">
            <el-input
              class="tag-input"
              v-if="tagInputVisible"
              ref="tagInputRef"
              v-model="newTag"
              size="small"
              @keyup.enter="handleTagInputConfirm"
              @blur="handleTagInputConfirm"
            />
            <el-button
              class="tag-input-btn"
              v-else
              size="small"
              @click="showTagInput"
            >
              + New Tag
            </el-button>
          </div>
        </div>
      </div>
      <div class="content-box">
        <el-input
          class="content"
          v-model="content"
          type="textarea"
          placeholder="Please input"
        />
      </div>

      <div class="button-box">
        <BaseButton class="btn" @click="markdownRender">Preview</BaseButton>
      </div>
    </div>
    <div class="img-box"></div>
    <div class="preview-box">
      <div class="platform-box">
        <div
          :class="['icon-box', { selected: selectedPlatform === 'markdown' }]"
          @click="changeSelectedPlatform('markdown')"
        >
          <SvgIcon iconName="markdown" class="icon"></SvgIcon>
        </div>
        <div
          :class="['icon-box', { selected: selectedPlatform === 'wordpress' }]"
          @click="changeSelectedPlatform('wordpress')"
        >
          <SvgIcon iconName="wordpress" class="icon"></SvgIcon>
        </div>
        <div
          :class="['icon-box', { selected: selectedPlatform === 'weibo' }]"
          @click="changeSelectedPlatform('weibo')"
        >
          <SvgIcon iconName="weibo" class="icon"></SvgIcon>
        </div>
        <div
          :class="['icon-box', { selected: selectedPlatform === 'x' }]"
          @click="changeSelectedPlatform('x')"
        >
          <SvgIcon iconName="x" class="icon"></SvgIcon>
        </div>
        <div
          :class="['icon-box', { selected: selectedPlatform === 'facebook' }]"
          @click="changeSelectedPlatform('facebook')"
        >
          <SvgIcon iconName="facebook" class="icon"></SvgIcon>
        </div>
      </div>
      <div class="preview markdown-body" v-html="renderedHtml"></div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";

export default {
  data() {
    return {
      // input values
      title: null,
      content: null,
      newTag: null,
      tags: ["Tag1", "Tag2", "Tag3"],

      // preview
      renderedHtml: null,
      md: new MarkdownIt("commonmark", {
        html: true,
        linkify: true,
        typographer: true,
      }),
      //controls
      tagInputVisible: false,
      selectedPlatform: "markdown",
    };
  },
  methods: {
    markdownRender() {
      const result = this.md.render(this.content);
      this.renderedHtml = result;
    },
    changeSelectedPlatform(platform) {
      this.selectedPlatform = platform;
    },
    handleTagClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    handleTagInputConfirm() {
      if (this.newTag) {
        this.tags.push(this.newTag);
      }
      this.tagInputVisible = false;
      this.newTag = "";
    },
    showTagInput() {
      this.tagInputVisible = true;
      this.$nextTick(() => {
        this.$refs.tagInputRef.focus();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "github-markdown-css/github-markdown.css";
.panel-box {
  @include flex-box(row);
  // height: 100%;
  gap: 0.2rem;
  height: 100%;

  .edit-box {
    // border: 0.2rem solid rgba($secondary-color, 0.6);

    padding: 0 1rem;
    flex: 0 1 45%;

    @include flex-box(column);
    gap: 1rem;
    .other-box {
      // border: 0.1rem solid #000;
      flex: 0 1 10%;
      max-width: 100%;
      @include flex-box(column);
      gap: 0.6rem;
      // padding: 0.5rem 0.5rem;
      .title {
        .form-item {
          flex: 0 1 10%;
          @include flex-box(row);
          gap: 0.5rem;
          .label {
            flex: 0 1 10%;
            @include flex-center(row);
          }
          .input {
            flex: auto;
          }
        }
      }

      .hashtags {
        flex: auto;
        flex-wrap: wrap; /* 当子元素超出容器宽度时换行 */
        @include flex-box(row);
        align-items: center;
        gap: 0.8rem;
        .input-box {
          width: 8rem;
          .tag-input {
            width: 100%;
          }
          .tag-input-btn {
            width: 100%;
          }
        }

        .tag {
          user-select: none;
          // border: 0.2rem solid #000;
        }
      }
    }
    .content-box {
      flex: auto;

      // padding: 0 1rem;

      .content {
        height: 100%;
      }
    }

    .button-box {
      // border: 0.2rem solid rgba($secondary-color, 0.6);
      flex: 0 1 10%;
      @include flex-center(row);
      .btn {
        border-radius: 0.8rem;
        width: 60%;
        height: 100%;
      }
    }
  }
  .img-box {
    border: 0.2rem solid rgba($secondary-color, 0.6);

    flex: 1 1 10%;
  }
  .preview-box {
    // border: 0.2rem solid rgba($secondary-color, 0.6);

    flex: 0 1 45%;

    @include flex-box(column);
    gap: 1rem;
    .platform-box {
      // border: 0.2rem solid rgba($secondary-color, 0.6);
      flex: 0 1 10%;
      max-height: 10%;
      @include flex-center(row);
      gap: 2rem;

      .icon-box {
        @include platform-card();
        padding: 0.5rem 1.5rem;
        .icon {
          height: $icon-size-large;
          width: $icon-size-large;
        }
      }
    }
    .preview {
      // border: 0.2rem solid rgba($secondary-color, 0.6);
      padding-left: 1rem;
      flex: auto;
      overflow: auto;
      background-color: $background-color-white;
      border-radius: 0.8rem;
      box-shadow: inset 0.3rem 0.3rem 0.5rem #4444442a,
        inset -0.3rem -0.3rem 0.5rem #4444442a;
    }
  }
  .divider {
    width: 0.5rem;
    background-color: rgba($secondary-color, 0.6);
    // margin: 0.5rem 0;

    border-radius: 5rem;
  }
}
</style>

<style lang="scss">
.markdown-body {
  ul,
  ol {
    padding-left: 2rem; /* 通过设置左侧内边距来添加缩进 */
  }
}
.el-dialog.publish-panel-card {
  .el-dialog__body {
    .edit-box {
      .content-box {
        .el-textarea.content {
          .el-textarea__inner {
            resize: none;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
