<template>
  <div class="box">
    <el-calendar class="publish" v-model="calendar_data"></el-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      calendar_data: null,
    };
  },
  watch: {
    calendar_data(newVal) {
      console.log(typeof newVal);
      console.log(newVal);
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  @include flex-box(row);
  align-items: center;
  justify-content: center;
  // transition: flex 0.2s ease-out;
}
</style>

<style lang="scss">
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

        &.prev,
        &.next {
          color: rgba($secondary-color, 0.7);
        }

        transition: color 0.2s ease-out, background-color 0.2s ease-out,
          font-size 0.2s ease-out, font-weight 0.2s ease-out,
          box-shadow 0.1s ease-out;

        &:hover,
        &.is-selected {
          color: $primary-color;
          background-color: $secondary-color;
          font-weight: $font-weight-bold;
          font-size: 1.5rem;
        }

        &.is-selected {
          box-shadow: inset 0.3rem 0.5rem 0.5rem rgba(0, 0, 0, 0.26);
        }
        &:hover {
          box-shadow: 0.3rem 0.5rem 0.5rem rgba(0, 0, 0, 0.26);
        }

        &.is-today {
          color: $third-color;
          font-weight: $font-weight-bold;
          font-size: 1.5rem;

          &:hover {
            color: $third-color-light;
          }
          &.is-selected {
            color: $third-color-light;
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
