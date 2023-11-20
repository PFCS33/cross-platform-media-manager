<template>
  <div class="personal-info-box">
    <div class="title-box">
      <span class="title">Account Config</span>
    </div>
    <div class="form">
      <div class="avatar-box">
        <div class="image-box">
          <img :src="userInfo.avatar" class="image" />
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
          <lable class="label">Account</lable>
          <el-input
            class="input"
            :disabled="!editMode"
            :placeholder="userInfo.account"
          ></el-input>
        </div>
        <div class="input-box">
          <lable class="label">Account Name</lable>
          <el-input
            class="input"
            :disabled="!editMode"
            :placeholder="userInfo.name"
          ></el-input>
        </div>
      </div>
      <div class="divider"></div>
      <div class="personal-box">
        <div class="input-box">
          <lable class="label">Phone</lable>
          <el-input
            class="input"
            :placeholder="userInfo.phone"
            :disabled="!editMode"
          ></el-input>
        </div>
        <div class="input-box">
          <lable class="label">Real Name</lable>
          <el-input
            class="input"
            :placeholder="userInfo.real_name"
            :disabled="!editMode"
          ></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editMode: false,
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters["auth/userInfo"];
    },
  },
};
</script>

<style lang="scss" scoped>
.personal-info-box {
  @include flex-box(column);
  @include container-base();
  padding: 2rem 3rem;
  gap: 2rem;
  .title-box {
    .title {
      font-size: 2.2rem;
      color: $secondary-color-dark;
      font-weight: $font-weight-bold;
    }
  }
  .divider {
    height: 0.5rem;
    background-color: rgba($secondary-color, 0.6);
    // margin: 2rem 0;

    border-radius: 5rem;
  }
  .form {
    // border: 1px solid red;
    flex: auto;
    @include flex-box(column);

    // width: 60%;
    // gap: 1rem;
    gap: 2rem;
    // padding: 10rem 1rem;
    width: 70%;
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
            transition: border-radius 0.3s ease-out, border-color 0.3s ease-out;
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
  }
}
</style>
