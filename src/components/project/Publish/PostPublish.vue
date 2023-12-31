<template>
  <div class="box" v-loading="loading">
    <el-dialog
      class="publish-panel-card"
      destroy-on-close
      v-model="showEditPanel"
      :show-close="false"
    >
      <template #header>
        <div class="title-box">
          <h1 class="title">EDIT YOUR POST</h1>
          <div class="time-box">
            <span class="fixed-time"> {{ selectedDay }}</span>
            <BaseButton
              :class="['btn', { active: publishNow }]"
              @click="togglePublishNow"
              v-if="isToday(selectedDay)"
              >Publish Now</BaseButton
            >
            <div class="accurate-time">
              <el-time-select
                v-model="selecedAccurateTime"
                :start="timeSelectedStart"
                step="00:01"
                end="23:59"
                placeholder="Select Time"
                :disabled="publishNow"
              />
            </div>
          </div>
        </div>
      </template>
      <PublishPanel
        :selectedDay="selectedDay"
        :selectedTime="selecedAccurateTime"
        ref="publishPanel"
        @closeWindow="showEditPanel = false"
      ></PublishPanel>
      <template #footer>
        <span class="dialog-footer">
          <BaseButton class="button cancle" @click="showEditPanel = false"
            >Cancel</BaseButton
          >
          <BaseButton class="button confirm" @click="publishPost">
            Publish
          </BaseButton>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      class="detail-panel-card"
      destroy-on-close
      v-model="showDetailPanel"
      :show-close="false"
    >
      <template #header>
        <div class="title-box">
          <SvgIcon
            class="icon"
            iconName="delete"
            @click="showDetailPanel = false"
          ></SvgIcon>
        </div>
      </template>
      <ArticleDetail></ArticleDetail>
      <template #footer></template>
    </el-dialog>
    <el-calendar class="publish" v-if="showCalendar" v-model="calendar_data">
      <template #date-cell="{ data }">
        <div class="calendar-cell">
          <div class="header">
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split("-")[2] }}
            </p>
            <transition name="fade-icon" mode="out-in">
              <SvgIcon
                v-if="data.isSelected && !isPastDate(data.day)"
                iconName="add"
                class="icon"
                @click="openEditView(data.day)"
              ></SvgIcon>
            </transition>
          </div>
          <el-tooltip
            placement="right"
            :visible="plans.get(data.day) ? plans.get(data.day).more : false"
            effect="customized"
          >
            <template #content>
              <div
                class="more-card"
                v-for="(plan, index) in plans.get(data.day).data.slice(1)"
              >
                <div
                  class="plan-card"
                  @click="
                    openDetailView(plans.get(data.day).data[index + 1].id)
                  "
                >
                  <div class="title-box">
                    <span class="title">
                      {{ plan.time.split(" ")[1] }} - {{ plan.title }}
                    </span>
                  </div>
                  <div class="platform-box">
                    <div v-for="platform in plan.platforms">
                      <SvgIcon :iconName="platform" class="icon"></SvgIcon>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="body">
              <div
                class="plan-card"
                v-if="plans.get(data.day)"
                @click="openDetailView(plans.get(data.day).data[0].id)"
              >
                <div class="title-box">
                  <span class="title">
                    {{ plans.get(data.day).data[0].time.split(" ")[1] }} -
                    {{ plans.get(data.day).data[0].title }}
                  </span>
                </div>
                <div class="platform-box">
                  <div
                    v-for="platform in plans.get(data.day).data[0].platforms"
                  >
                    <SvgIcon :iconName="platform" class="icon"></SvgIcon>
                  </div>
                </div>
              </div>
              <div
                class="more-card"
                v-if="
                  plans.get(data.day) && plans.get(data.day).data.length > 1
                "
              >
                <SvgIcon
                  iconName="more"
                  class="icon"
                  @click="toggleMoreInfo(plans.get(data.day))"
                ></SvgIcon>
              </div>
            </div>
          </el-tooltip>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
import PublishPanel from "./PublishPanel.vue";
import ArticleDetail from "@/components/project/publish/ArticleDetail.vue";
export default {
  components: {
    PublishPanel,
    ArticleDetail,
  },

  data() {
    return {
      publishNow: false,
      selectedDay: null,
      selecedAccurateTime: null,

      calendar_data: null,
      showCalendar: false,
      showEditPanel: false,
      showDetailPanel: false,
    };
  },
  computed: {
    plans() {
      return this.$store.getters["publish/plans"];
    },
    loading() {
      return this.$store.getters["publish/planLoading"];
    },
    error() {
      return this.$store.getters["publish/planError"];
    },

    timeSelectedStart() {
      return this.isToday(this.selectedDay)
        ? this.formatTime(new Date())
        : "00:00";
    },

    currentTime() {
      return this.formatTime(new Date());
    },

    isPublished() {
      return this.$store.getters["publish/isPublished"];
    },
  },
  watch: {
    calendar_data(newVal) {
      // get formatted date
      // const date = new Date(newVal);
      // const year = date.getFullYear();
      // const month = date.getMonth() + 1;
      // const day = date.getDate();
      // const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
      //   day < 10 ? "0" + day : day
      // }`;
      // console.log(formattedDate);
    },
    error(newVal) {
      if (newVal.state) {
        ElMessage.error(`Error: ${newVal.message}`);
        setTimeout(() => ElMessage.error("Please try again"), 500);
      } else {
        ElMessage.success(`${newVal.message}`);
      }
    },
    plans(newVal) {
      if (newVal) {
        this.showCalendar = true;
      }
    },
  },

  methods: {
    togglePublishNow() {
      this.publishNow = !this.publishNow;
    },
    isPastDate(day) {
      const today = new Date();
      const todayDateOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      return new Date(day) < todayDateOnly;
    },
    isToday(dateStr) {
      const today = new Date();
      const selectedDate = new Date(dateStr);
      return selectedDate.toDateString() === today.toDateString();
    },
    formatTime(date) {
      let hours = date.getHours().toString().padStart(2, "0");
      let minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    },
    publishPost() {
      this.$refs.publishPanel.openAccountDialog();
      //TODO: GET Data
      // const content =
      //   "Today marks the *beginning* of my journey in the **mystical world of Rivellon**, part of the acclaimed _'Divinity: Original Sin 2'_ adventure. Here's what I'm looking forward to:\n\n- **Exploring Vast Landscapes**: Discovering every hidden nook and cranny in this beautifully crafted world.\n- **Engaging in Tactical Combat**: Testing my skills against Rivellon's most challenging adversaries.\n- **Making Meaningful Choices**: Every decision I make will shape my journey in unexpected ways.\n\n> \"In the world of Rivellon, every choice carries weight and consequence.\"\n\nFollow my adventure and share your own experiences:\n- ![Rivellon Landscape](https://i.imgur.com/c0uLyT7.png) *Stunning landscapes await!*\n- [Divinity Community Forum](https://www.divinity.com/forum)";
      // const title = "Divinity: Original Sin 2";
      // const username = "test";
      // const password = "test";
      // const url = "http://127.0.0.1:5000" + "/wordpress_post";
      // const res = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     content: content,
      //     title: title,
      //     username: username,
      //     password: password,
      //   }),
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log(data);
      //   })
      //   .catch((error) => {
      //     console.log("error");
      //   });

      // showEditPanel = false
    },
    openDetailView(id) {
      this.showDetailPanel = true;
      this.$nextTick(() => {
        this.$store.dispatch("publish/getDetailInfo", { id: id });
      });
      console.log(id);
    },
    openEditView(day) {
      this.selectedDay = day;
      this.selecedAccurateTime = this.currentTime;
      this.showEditPanel = true;
    },
    toggleMoreInfo(info) {
      info.more = !info.more;
    },
  },
  mounted() {
    if (!this.isPublished) {
      this.$store.dispatch("publish/getPlanInfo");
    } else {
      this.showCalendar = true;
    }
  },
};
</script>

<style lang="scss" scoped>
@include fade-icon();

.box {
  width: 100%;
  height: 100%;
  @include flex-box(row);
  align-items: center;
  justify-content: center;
  // transition: flex 0.2s ease-out;

  .calendar-cell {
    @include flex-box(column);
    height: 100%;
    gap: 0.4rem;
    .header {
      position: relative;
      flex: 0 1 0;
      .icon {
        width: calc($icon-size-small - 0.3rem);
        height: calc($icon-size-small - 0.3rem);
        position: absolute;
        fill: $third-color-light;
        top: 5%;
        right: 1%;

        transition: fill 0.2s ease-out;
        &:hover {
          fill: $third-color;
        }
      }
    }
    .body {
      // flex: auto;
      height: fit-content;
      @include flex-box(row);

      max-height: 100%;
      overflow: visible;

      justify-content: space-between;

      .plan-card {
        flex: 0 1 85%;
        height: fit-content;

        border-radius: 0.5rem;
        padding: 0.4rem 0.7rem;

        background-color: $secondary-color;
        // border: 0.2rem solid $secondary-color;
        border: none;

        transition: background-color 0.2s ease-out, border 0.2s ease-out,
          box-shadow 0.2s ease-out;

        &:hover {
          box-shadow: 0.4rem 0.5rem 0.4rem rgba(0, 0, 0, 0.26);
        }

        @include flex-box(column);
        gap: 0.3rem;
        .title-box {
          @include flex-box(row);
          justify-content: start;
          .title {
            font-size: 1rem;
            color: $primary-color;
            font-weight: $font-weight-bold;
            transition: color 0.2s ease-out;

            max-height: 2rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .platform-box {
          @include flex-box(row);
          justify-content: flex-end;
          .icon {
            width: calc($icon-size-small - 0.6rem);
            height: calc($icon-size-small - 0.6rem);
            margin-left: 0.5rem;
            fill: $third-color-light;
            transition: fill 0.2s ease-out;
          }
        }
      }
      .more-card {
        width: fit-content;
        @include flex-box(row);
        align-items: center;

        .icon {
          width: calc($icon-size-small - 0.2rem);
          height: calc($icon-size-small - 0.2rem);
          fill: $secondary-color;
          transition: fill 0.2s ease-out, transform 0.2s ease-out;
        }
      }
    }
  }
}
</style>

<style lang="scss">
/* 设置scroll bar的宽度和颜色 */
::-webkit-scrollbar {
  width: 0.6rem;
  height: 0.6rem;
  background-color: transparent;
}

/* 设置scroll bar thumb的样式 */
::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 0.3rem;
}

/* 设置scroll bar thumb在hover状态下的样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}

.el-dialog.detail-panel-card {
  padding: 1.8rem 2.3rem 1rem 2.3rem;
  margin-top: 1%;
  width: 90%;
  height: 90%;
  max-height: 90%;
  border-radius: 1rem;
  background-color: $background-color-gray;
  @include flex-box(column);
  .el-dialog__header {
    margin-right: 0;
    padding: 0;
    .title-box {
      .icon {
        position: absolute;
        top: 0.3rem;
        right: 0.3rem;
        @include icon-style($icon-size-large, $secondary-color);
        transition: fill 0.2s ease-out;
        cursor: pointer;
        &:hover {
          fill: $secondary-color-dark;
        }
      }
    }
  }

  .el-dialog__body {
    padding: 0;
    flex-grow: 1;
    flex-shrink: 1;

    overflow: auto;
  }
  .el-dialog__footer {
    padding: 0;
  }
}

.el-dialog.publish-panel-card {
  margin-top: 1%;
  width: 90%;
  height: 90%;

  padding: 1.8rem 2.3rem 1.2rem 2.3rem;
  border-radius: 1rem;
  @include flex-box(column);
  // gap: 0rem;
  justify-content: space-between;
  background-color: $background-color-gray;
  --el-color-primary: #{$secondary-color};

  .el-dialog__header {
    // flex: 0 1 10%;
    margin-right: 0;
    margin-bottom: 0.6rem;
    // padding: 1.8rem;
    padding: 0;

    .title-box {
      @include flex-box(row);
      align-items: center;
      justify-content: space-between;

      .title {
        color: $secondary-color-dark;
        font-size: 2.6rem;
      }
    }

    .time-box {
      @include flex-box(row);
      gap: 1rem;
      .fixed-time {
        user-select: none;
        @include flex-box(row);
        align-items: center;
        font-weight: $font-weight-bold;
        color: $primary-color;
        background-color: $secondary-color-dark;
        // border: 0.1rem solid #dcdfe6;
        border: none;
        padding: 0.7rem;

        border-radius: 0.4rem;
      }
      .btn {
        border-radius: 0.4rem;
        &:hover {
        }
        &.active {
          color: $third-color-light;
          background-color: $secondary-color-dark;
        }
      }

      .accurate-time {
        width: 15rem;
        .el-select {
          // border: none;
          --el-color-primary: #{$secondary-color};

          // background-color: $secondary-color;
          // --el-select-border-color-hover: #{$primary-color-dark};
          .el-input__wrapper {
            // background-color: $secondary-color;
            // --el-input-placeholder-color: #{rgba($primary-color, 0.4)};
            // --el-input-border-color: #{$secondary-color};
            --el-input-border-radius: 0.4rem;

            .el-input__inner {
              color: $secondary-color;
            }
            .el-input__prefix {
              svg {
                color: $secondary-color;
              }
            }
          }
        }
      }
    }
  }
  .el-dialog__body {
    flex: 1 0 auto;
    padding: 0;
    max-height: 80%;
  }

  .el-dialog__footer {
    // flex: 0 1 auto;
    // padding: 0.8rem 1rem;
    padding: 0;

    .dialog-footer {
      @include flex-box(row);
      justify-content: end;
      gap: 1rem;

      .button {
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

.el-popper__arrow::before {
  background: $secondary-color;
  right: 0;
}
.el-popper.is-customized {
  @include flex-box(column);
  gap: 0.8rem;
  background: $secondary-color;

  .more-card {
    .plan-card {
      height: fit-content;

      border-radius: 0.5rem;
      padding: 0.4rem 0.7rem;

      background-color: $background-color-white;

      border: none;

      transition: background-color 0.2s ease-out, border 0.2s ease-out,
        box-shadow 0.2s ease-out;

      @include flex-box(column);
      gap: 0.3rem;
      .title-box {
        @include flex-box(row);
        justify-content: start;
        .title {
          font-size: 1rem;
          // color: $primary-color;
          color: $primary-color-dark;
          font-weight: $font-weight-bold;

          transition: color 0.2s ease-out;
        }
      }
      .platform-box {
        @include flex-box(row);
        justify-content: flex-end;
        .icon {
          width: calc($icon-size-small - 0.6rem);
          height: calc($icon-size-small - 0.6rem);
          margin-left: 0.5rem;
          // fill: $third-color-light;
          fill: $secondary-color;
          transition: fill 0.2s ease-out;
        }
      }
      &:hover {
        box-shadow: 0.3rem 0.5rem 0.4rem rgba(0, 0, 0, 0.56);
        cursor: pointer;
        background-color: $secondary-color-dark;

        .title-box {
          .title {
            color: $primary-color;
          }
        }
        .platform-box {
          .icon {
            fill: $third-color-light;
          }
        }
      }
    }
  }
}

.el-calendar.publish {
  user-select: none;
  --el-calendar-selected-bg-color: #{$secondary-color};
  --el-color-primary: #{$primary-color-dark};

  --el-calendar-cell-width: 7rem;
  background-color: transparent;
  padding: 0 5rem;

  .el-calendar__header {
    border-bottom-color: $secondary-color;
    border-width: 0.2rem;
    .el-calendar__title {
      text-transform: uppercase;
      font-weight: $font-weight-bold;
      color: $secondary-color;
      font-size: 2rem;
    }
    .el-button {
      // background-color: $background-color;
      color: $secondary-color;
      --el-button-bg-color: $background-color;
      --el-button-border-color: $background-color;

      --el-button-hover-border-color: $background-color;
      --el-button-active-border-color: $background-color;

      --el-button-hover-bg-color: #{rgba($third-color-light, 0.5)};
      --el-button-active-bg-color: #{rgba($third-color-light, 0.5)};
    }
  }
  .el-calendar__body {
    .el-calendar-table {
      border-spacing: 0.1rem;
      .el-calendar-day {
        padding: 0;
        padding-top: 0.1rem;
        padding-left: 0.5rem;
      }
      th {
        text-transform: uppercase;
        font-weight: $font-weight-bold;
        color: rgba($text-secondary-color, 0.7);
      }
      td {
        border-radius: 0.5rem;
        border-width: 0.2rem;
        border-color: $secondary-color;
        color: $secondary-color-dark;
        transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out;

        .header {
          transition: font-weight 0.2s ease-out, color 0.2s ease-out;
        }
        &.prev,
        &.next {
          .header {
            color: rgba($secondary-color, 0.7);
          }
        }

        &:hover,
        &.is-selected {
          background-color: $secondary-color;
          .header {
            color: $primary-color;
            font-weight: $font-weight-bold;
          }
          .body {
            .plan-card {
              background-color: $background-color-white;
              // border: 0.2rem solid $primary-color;

              .title {
                color: $primary-color-dark;
              }
              .icon {
                fill: $secondary-color;
              }
            }
            .more-card {
              .icon {
                fill: $primary-color;

                &:hover {
                  transform: scale(1.5);
                  fill: rgba($primary-color, 0.7);
                }
              }
            }
          }
        }

        &.is-selected {
          // box-shadow: inset 0.3rem 0.5rem 0.5rem rgba(0, 0, 0, 0.26);
        }
        &:hover {
          // box-shadow: 0.3rem 0.5rem 0.5rem rgba(0, 0, 0, 0.26);
        }

        &.is-today {
          .header {
            color: $third-color;
            font-weight: $font-weight-bold;
            font-size: 1.5rem;
          }

          &:hover {
            .header {
              color: $third-color-light;
            }
          }
          &.is-selected {
            .header {
              color: $third-color-light;
            }
          }
        }

        .el-calendar-day {
          border-radius: 0.5rem;
          transition: background-color 0.2s ease-out;
        }
      }
    }
  }
}
</style>
