<template>
  <div class="panel-box">
    <AccountSelecetBoard ref="accountSelectBoard"></AccountSelecetBoard>
    <div class="edit-box">
      <div class="other-box">
        <div class="title">
          <div class="form-item">
            <span class="label">TITLE</span>
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
          placeholder="Please input the content of your post"
        />
      </div>

      <div class="button-box">
        <BaseButton class="btn" @click="markdownRender">Preview</BaseButton>
        <BaseButton class="btn draft" @click="saveAsDraft"
          >Save as draft</BaseButton
        >
      </div>
    </div>
    <div class="img-box">
      <div class="upload-card">
        <label for="imgInput" class="upload-btn" v-loading="imageUploading">
          <SvgIcon iconName="add-pic" class="icon"></SvgIcon>
        </label>
        <input
          id="imgInput"
          @change="imageUpload"
          type="file"
          accept="image/*"
          class="file-input"
          ref="imageInputRef"
        />
        <transition-group name="list" tag="div" class="image-preview-box">
          <div
            class="image-preview-wrapper"
            v-for="image in imageList"
            :key="image.id"
          >
            <div class="image-preview">
              <el-image
                class="image"
                :alt="image.id"
                :src="image.url"
                fit="contain"
              />
              <div class="hover-overlay">
                <SvgIcon
                  iconName="copy"
                  class="icon"
                  @click="copyURL2Clipboard(image)"
                ></SvgIcon>
                <SvgIcon
                  iconName="delete "
                  class="icon"
                  @click="deleteImage(image.id)"
                ></SvgIcon>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    <div class="preview-box">
      <div class="preview markdown-body" v-html="renderedHtml"></div>
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
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import { imgurUpload } from "@/services/imgur.js";
import AccountSelecetBoard from "./AccountSelecetBoard.vue";

export default {
  components: {
    AccountSelecetBoard,
  },
  props: {
    initialValues: {
      type: Object,
      default: () => ({}),
    },
    selectedDay: {
      type: String,
      default: null,
    },
    selectedTime: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      // showAccountPanel: false,
      // input values
      title: this.initialValues.title || null,
      content: this.initialValues.content || null,
      newTag: null,
      tags: this.initialValues.topics || ["Tag1", "Tag2", "Tag3"],

      // images
      imageUploading: false,
      // imageList: [],
      imageList: [
        {
          id: "1",
          url: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
        },
        {
          id: "2",
          url: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
        },
        {
          id: "3",
          url: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
        },
        {
          id: "4",
          url: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
        },
        {
          id: "5",
          url: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
        },
      ],
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
  computed: {
    currentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    },
  },
  watch: {},
  methods: {
    openAccountDialog() {
      // this.showAccountPanel = true;
      this.$refs.accountSelectBoard.showAccountPanel = true;
    },
    async saveAsDraft() {
      // console.log("save");
      //TODO: GET Data

      //       - **id**: INTEGER - 草稿的唯一标识符。
      // - **user_id**: INTEGER - 创建草稿的用户ID，引用 User 表的外键。
      // - **title**: STRING - 草稿标题。
      // - **topics**: ARRAY - 草稿主题列表。
      // - **content**: TEXT - 草稿内容。
      // - **scheduled_time**: TIMESTAMP - 计划发布时间。
      // - **last_edit_time**: TIMESTAMP - 上次编辑时间。
      const content =
        "Today marks the *beginning* of my journey in the **mystical world of Rivellon**, part of the acclaimed _'Divinity: Original Sin 2'_ adventure. Here's what I'm looking forward to:\n\n- **Exploring Vast Landscapes**: Discovering every hidden nook and cranny in this beautifully crafted world.\n- **Engaging in Tactical Combat**: Testing my skills against Rivellon's most challenging adversaries.\n- **Making Meaningful Choices**: Every decision I make will shape my journey in unexpected ways.\n\n> \"In the world of Rivellon, every choice carries weight and consequence.\"\n\nFollow my adventure and share your own experiences:\n- ![Rivellon Landscape](https://i.imgur.com/c0uLyT7.png) *Stunning landscapes await!*\n- [Divinity Community Forum](https://www.divinity.com/forum)";
      const title = "Divinity: Original Sin 2";
      // const username = "test";
      // const password = "test";
      const url = "http://127.0.0.1:5000" + "/insert_script";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          title: title,
          topics: "asd asd sad sad",
          scheduled_time: "2020-01-30 12:00",
          last_edit_time: "2020-01-30 12:00",
          content: content,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log("error");
        });
    },

    copyURL2Clipboard(image) {
      // navigator.clipboard 只能在安全环境中使用：localhost / https
      // navigator.clipboard
      //   .writeText(image.url)
      //   .then(() => {
      //     // 显示复制成功的消息
      //     alert("URL copied to clipboard");
      //   })
      //   .catch((err) => {
      //     // 处理复制失败的情况
      //     alert("Failed to copy URL: ", err);
      //   });
      // another abandoned way, but works in unsafe environment
      const text = `![${image.id}](${image.url})`;
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      ElNotification({
        title: "Success",
        message: "Image URL copied to clipboard",
        type: "success",
      });

      //
    },
    deleteImage(imageId) {
      this.imageList = this.imageList.filter((image) => image.id !== imageId);
    },
    imageUpload(event) {
      const uploadedImage = event.target.files[0];

      if (uploadedImage) {
        if (uploadedImage.size > 1024 * 1024 * 2) {
          ElNotification({
            title: "Error",
            message: "Image size should be less than 2MB",
            type: "error",
          });
          return;
        }

        if (!uploadedImage.type.match("image.*")) {
          ElNotification({
            title: "Error",
            message: "Only image type is allowed",
            type: "error",
          });
          return;
        }

        this.imageUploading = true;
        const formData = new FormData();
        formData.append("image", uploadedImage);
        // formData.append("type", "file");
        // formData.append('name', uploadedImage.name);
        // formData.append('title', uploadedImage.name);
        // formData.append('description', uploadedImage.name);

        imgurUpload(formData)
          .then((imageInfo) => {
            ElMessage.success("image upload success");

            this.$nextTick(() => {
              this.imageList.push(imageInfo);
              this.imageUploading = false;
            });
          })
          .catch((error) => {
            ElMessage.error(error.message);
            this.imageUploading = false;
          });

        this.$refs.imageInputRef.value = "";
      }
    },

    markdownRender() {
      const tagsText = this.tags.map((tag) => "#" + tag).join(" ");

      const result = this.md.render(tagsText + "\n\n" + (this.content || ""));

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
@include list-column-animation();
.panel-box {
  @include flex-box(row);
  // height: 100%;
  gap: 0.2rem;
  height: 100%;

  .edit-box {
    // border: 0.2rem solid rgba($secondary-color, 0.6);

    // padding: 0 1rem;
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
            color: $secondary-color;
            font-weight: $font-weight-bold;
            padding: 0 0.5rem;
            border: 0.2rem solid rgba($secondary-color, 0.8);
            border-radius: 0.8rem;
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
      flex: 0 1 9%;
      @include flex-center(row);
      gap: 1rem;
      .btn {
        border-radius: 0.8rem;
        width: 60%;
        height: 100%;
        &.draft {
          background-color: $third-color;
          &:hover {
            background-color: $third-color-dark;
          }
        }
      }
    }
  }
  .img-box {
    // border: 0.2rem solid rgba($secondary-color, 0.6);
    // border-radius: 5rem;
    // border-top: 0.5rem solid rgba($secondary-color, 0.6);
    // border-bottom: 0.5rem solid rgba($secondary-color, 0.6);
    // background-color: $secondary-color;
    flex: auto;
    max-width: 10%;

    .upload-card {
      width: 100%;
      height: 100%;
      @include flex-box(column);
      align-items: center;
      gap: 0.5rem;

      .upload-btn {
        @include flex-center(row);
        width: 8rem;
        height: 8rem;
        min-height: 8rem;
        cursor: pointer;

        border: 0.2rem dashed rgba($secondary-color, 0.6);
        @include flex-center(row);
        transition: border-radius 0.3s ease-out, border-color 0.3s ease-out;
        border-radius: 0.5rem;
        .icon {
          @include icon-style($icon-size-large, rgba($secondary-color, 0.4));
          transition: fill 0.3s ease-out;
        }

        &:hover,
        &:active {
          border-radius: 0.8rem;
          border-color: rgba($secondary-color, 0.3);
          .icon {
            fill: rgba($secondary-color, 0.25);
          }
        }
      }
      .file-input {
        display: none;
      }

      .image-preview-box {
        flex: 1 1 auto;
        overflow: auto;

        width: 100%;
        max-width: 100%;

        @include flex-box(column);
        align-items: center;
        gap: 0.5rem;

        .image-preview-wrapper {
          .image-preview {
            position: relative;
            .image {
              width: 8rem;
              height: 8rem;
              background-color: $background-color-white;
              // background-color: $secondary-color;
              border-radius: 0.5rem;
            }
            .hover-overlay {
              width: 100%;
              height: 100%;
              opacity: 0;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.4);
              border-radius: 0.5rem;
              cursor: pointer;
              transition: opacity 0.3s ease-out;

              @include flex-center(row);
              gap: 0.6rem;

              .icon {
                @include icon-style(
                  $icon-size-regular,
                  rgba($primary-color, 1)
                );
                transition: transform 0.2s ease-out, fill 0.2s ease-out;
                &:hover {
                  transform: scale(1.1);
                  fill: lighten($primary-color, 10%);
                }
              }

              &:hover {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
  .preview-box {
    // border: 0.2rem solid rgba($secondary-color, 0.6);

    flex: 0 1 45%;
    max-width: 45%;

    @include flex-box(row);
    gap: 1rem;
    .platform-box {
      // border: 0.2rem solid rgba($secondary-color, 0.6);
      flex: 0 1 10%;
      max-width: 10%;
      @include flex-center(column);
      gap: 0.8rem;
      justify-content: start;

      .icon-box {
        @include platform-card();
        padding: 0.5rem 0.8rem;
        .icon {
          height: $icon-size-large;
          width: $icon-size-large;
        }
      }
    }
    .preview {
      // border: 0.2rem solid rgba($secondary-color, 0.6);
      padding-left: 1.3rem;
      padding-top: 0.6rem;
      flex: auto;
      overflow: auto;

      background-color: $background-color-white;
      border-radius: 0.8rem;
      box-shadow: inset 0.2rem 0.2rem 0.5rem rgba($secondary-color, 0.3),
        inset -0.2rem -0.2rem 0.5rem rgba($background-color-gray, 1);
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
    .other-box {
      .hashtags {
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
