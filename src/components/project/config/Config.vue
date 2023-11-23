<template>
  <div class="config-box" v-loading="loading">
    <div class="menu-box">
      <el-menu
        active-text-color="#cf9dca"
        text-color="#64748b"
        class="config-menu"
        default-active="1"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          <span>User Info</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span>Reset Password</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="form-container">
      <transition name="fade">
        <div
          v-if="activeComponent === 'userInfo'"
          class="personal-info-box common-box"
        >
          <div class="title-box">
            <span class="title">User Infomation Config</span>
          </div>
          <div class="form common-form" v-if="showContent">
            <div class="avatar-box">
              <div class="image-box">
                <img :src="avatar" class="image" />
                <div class="input-box">
                  <label for="imgInput" class="upload-btn">
                    <SvgIcon iconName="add-pic" class="icon"></SvgIcon>
                  </label>
                  <input
                    id="imgInput"
                    @change="imageUpload"
                    type="file"
                    accept="image/*"
                    class="file-input"
                    ref="imageInputRef"
                    :disabled="!editMode"
                  />
                </div>
              </div>
              <el-switch v-model="editMode" />
            </div>
            <div class="divider"></div>
            <div class="account-box">
              <div class="input-box">
                <label class="label strong">Account</label>
                <el-input
                  class="input"
                  :disabled="!editMode"
                  :placeholder="userInfo.account"
                  v-model="account"
                ></el-input>
              </div>
              <div class="input-box">
                <label class="label">Account Name</label>
                <el-input
                  class="input"
                  :disabled="!editMode"
                  :placeholder="userInfo.name"
                  v-model="name"
                ></el-input>
              </div>
            </div>
            <div class="divider"></div>
            <div class="personal-box">
              <div class="input-box">
                <label class="label">Phone</label>
                <el-input
                  class="input"
                  :placeholder="userInfo.phone"
                  :disabled="!editMode"
                  v-model="phone"
                ></el-input>
              </div>
              <div class="input-box">
                <label class="label">Real Name</label>
                <el-input
                  class="input"
                  :placeholder="userInfo.real_name"
                  :disabled="!editMode"
                  v-model="real_name"
                ></el-input>
              </div>
            </div>

            <transition name="pull">
              <div class="button-box" v-if="editMode">
                <BaseButton class="btn confirm">Summit</BaseButton>
                <BaseButton class="btn">Clear</BaseButton>
              </div>
            </transition>
          </div>
        </div>

        <div
          v-else-if="activeComponent === 'resetPassword'"
          class="reset-password-box common-box"
        >
          <div class="title-box">
            <span class="title">Reset your Password</span>
          </div>
          <div class="form common-form">
            <div class="input-box">
              <label class="label">Original Password</label>
              <el-input
                class="input"
                type="password"
                placeholder="Enter your current password"
                v-model="oldPassword"
              ></el-input>
            </div>
            <div class="input-box">
              <label class="label">New Password</label>
              <el-input
                class="input"
                type="password"
                placeholder="Enter your new password"
                v-model="newPassword"
              ></el-input>
            </div>
            <div class="input-box">
              <label class="label">Confirm New Password</label>
              <el-input
                class="input"
                type="password"
                placeholder="repeat your new password"
                v-model="confirmPassword"
              ></el-input>
            </div>
            <div class="button-box">
              <BaseButton class="btn confirm">Summit</BaseButton>
              <BaseButton class="btn">Clear</BaseButton>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { imgurUpload } from "@/services/imgur.js";
export default {
  data() {
    return {
      editMode: false,
      showContent: false,
      activeComponent: "userInfo",

      avatar: null,
      name: null,
      phone: null,
      real_name: null,
      account: null,

      oldPassword: null,
      confirmPassword: null,
      newPassword: null,
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters["user/info"];
    },
    loading() {
      return this.$store.getters["user/infoLoading"];
    },
    error() {
      return this.$store.getters["user/infoError"];
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
    userInfo(newVal) {
      if (newVal) {
        this.showContent = true;
        this.avatar = newVal.avatar;
        this.account = newVal.account;
        this.name = newVal.name;
        this.phone = newVal.phone;
        this.real_name = newVal.real_name;
      }
    },
  },
  methods: {
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
        const formData = new FormData();
        formData.append("image", uploadedImage);
        // formData.append("type", "file");
        // formData.append('name', uploadedImage.name);
        // formData.append('title', uploadedImage.name);
        // formData.append('description', uploadedImage.name);

        imgurUpload(formData)
          .then((imageInfo) => {
            ElMessage.success("image upload success");
            console.log(imageInfo);
            this.avatar = imageInfo.url;
          })
          .catch((error) => {
            console.log(error);
            ElMessage.error(error.message);
          });

        this.$refs.imageInputRef.value = "";
      }
    },
    handleSelect(index) {
      if (index === "1") {
        this.activeComponent = "userInfo";
      } else if (index === "2") {
        this.activeComponent = "resetPassword";
      }
    },
  },
  mounted() {
    this.$store.dispatch("user/getUserInfo");
  },
};
</script>

<style lang="scss" scoped>
@include pull-animation();
@include fade-animation();

.config-box {
  @include container-base();
  @include flex-box(row);
  gap: 3rem;
  .menu-box {
    padding: 3rem 1rem;
    flex: 0 1 10%;
  }

  .form-container {
    flex: auto;
    position: relative;
    .common-box {
      padding: 2rem 0;
      @include flex-box(column);
      gap: 2rem;

      .title-box {
        .title {
          font-size: 2.2rem;
          color: $secondary-color-dark;
          font-weight: $font-weight-bold;
        }
      }
      .common-form {
        flex: auto;
        @include flex-box(column);
        gap: 2rem;
        width: 90%;

        .button-box {
          margin-top: 2rem;
          @include flex-box(row);
          justify-content: flex-start;
          gap: 1rem;
          .btn {
            width: 10rem;
            height: 4rem;
            font-size: 1.5rem;
            font-weight: $font-weight-bold;
            border-radius: 0.5rem;
            &.confirm {
              background-color: $third-color;
              // color: $secondary-color;
              &:hover {
                background-color: $third-color-dark;
              }
            }
          }
        }
      }
    }
  }

  .personal-info-box {
    .divider {
      height: 0.5rem;
      background-color: rgba($secondary-color, 0.6);
      border-radius: 5rem;
    }
    .form {
      .avatar-box {
        @include flex-box(row);
        justify-content: space-between;
        align-items: end;
        .image-box {
          // border: 1px solid red;
          @include flex-box(row);
          align-items: end;
          gap: 1rem;

          .image {
            width: 15rem;
            height: 15rem;
            border-radius: 0.5rem;
            object-fit: cover;
          }
          .input-box {
            height: 100%;
            @include flex-box(row);
            align-items: end;

            .upload-btn {
              @include flex-center(row);
              width: 4rem;
              height: 4rem;
              min-height: 4rem;
              cursor: pointer;

              border: 0.2rem dashed rgba($secondary-color, 0.6);
              @include flex-center(row);
              transition: border-radius 0.3s ease-out,
                border-color 0.3s ease-out;
              border-radius: 0.5rem;
              .icon {
                @include icon-style(
                  $icon-size-regular,
                  rgba($secondary-color, 0.4)
                );
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
          }
        }
      }
      .account-box,
      .personal-box {
        // border: 1px solid red;
        @include flex-box(column);
        gap: 1rem;
        .input-box {
          @include flex-box(row);
          gap: 0.2rem;

          .label {
            flex: 16%;
            font-size: 1.5rem;
            color: $secondary-color;
            @include flex-box(row);
            align-items: center;
            justify-content: start;

            &.strong {
              font-weight: $font-weight-bold;
              color: $third-color;
            }
          }
          .input {
          }
        }
      }
    }
  }

  .reset-password-box {
    .form {
      // border: 1px solid red;
      @include flex-box(column);
      gap: 2rem;
      margin-top: 2rem;
      .input-box {
        @include flex-box(row);
        gap: 0.2rem;

        .label {
          flex: 22%;
          font-size: 1.5rem;
          color: $secondary-color;
          @include flex-box(row);
          align-items: center;
          justify-content: start;
        }
        .input {
        }
      }
    }
  }
}
</style>

<style lang="scss">
.personal-info-box {
  .el-input {
    --el-color-primary: #{$secondary-color};
  }
  .el-switch {
    --el-switch-on-color: #{$third-color};
    --el-switch-off-color: #{rgba($secondary-color, 0.3)};
  }
}

.el-menu.config-menu {
  background-color: transparent;

  height: 100%;

  // box-shadow: 0.2rem 0.2rem 0.5rem 0rem rgba(0, 0, 0, 0.2);
  border-right: 0.3rem solid rgba($secondary-color, 0.3);
  .el-menu-item {
    // color: $secondary-color;
    font-size: 1.3rem;
    font-weight: $font-weight-bold;

    // &:hover {
    //   color: $third-color;
    // }
    // &:active {
    //   color: $third-color;
    // }
  }
}
</style>
