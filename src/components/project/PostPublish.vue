<template>
  <div class="box" v-loading="loading">
    <el-dialog v-model="showEditPanel" title="Edit your article">
      <div class="content">Balabala...</div>
      <template #footer>
        <span class="dialog-footer">
          <BaseButton @click="showEditPanel = false">Cancel</BaseButton>
          <BaseButton class="check" @click="showEditPanel = false">
            Confirm
          </BaseButton>
        </span>
      </template>
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
                v-if="data.isSelected"
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
                v-for="plan in plans.get(data.day).data.slice(1)"
              >
                <div class="plan-card">
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
              <div class="plan-card" v-if="plans.get(data.day)">
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
export default {
  data() {
    return {
      calendar_data: null,
      showCalendar: false,
      showEditPanel: false,
    };
  },
  watch: {
    calendar_data(newVal) {
      // get formatted date
      const date = new Date(newVal);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
      }`;
      console.log(formattedDate);
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
  computed: {
    plans() {
      return this.$store.getters["publish/plans"];
    },
    loading() {
      return this.$store.getters["publish/loading"];
    },
    error() {
      return this.$store.getters["publish/error"];
    },
  },
  methods: {
    openEditView(day) {
      console.log(day);
      this.showEditPanel = true;
    },
    toggleMoreInfo(info) {
      info.more = !info.more;
    },
  },
  mounted() {
    this.$store.dispatch("publish/getPlanInfo");
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
      overflow: hidden;

      justify-content: space-between;

      .plan-card {
        flex: 0 1 85%;
        height: fit-content;

        border-radius: 0.5rem;
        padding: 0.4rem 0.7rem;

        background-color: $secondary-color;
        // border: 0.2rem solid $secondary-color;
        border: none;

        transition: background-color 0.2s ease-out, border 0.2s ease-out;

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
  background-color: #f5f5f5;
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

      // background-color: $secondary-color;
      // border: 0.2rem solid $secondary-color;

      background-color: $background-color-white;
      // border: 0.2rem solid $primary-color;
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
        // box-shadow: inset 0.3rem 0.3rem 0.5rem rgba($primary-color, 0.5),
        //   inset -0.3rem -0.3rem 0.5rem rgba($primary-color, 0.5);
        box-shadow: 0.5rem 0.5rem 0.2rem rgba(0, 0, 0, 0.26);
        cursor: pointer;
        background-color: $secondary-color-dark;
        // border: 0.2rem solid $secondary-color-dark;
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
      // border-spacing: 0.2rem;
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
          box-shadow: inset 0.3rem 0.5rem 0.5rem rgba(0, 0, 0, 0.26);
        }
        &:hover {
          box-shadow: 0.3rem 0.5rem 0.5rem rgba(0, 0, 0, 0.26);
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
