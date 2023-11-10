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
  // padding: 2rem;
  background-color: transparent;
  // margin: 5rem;
  --el-calendar-cell-width: 7rem;
  padding: 0 5rem;
}
</style>
