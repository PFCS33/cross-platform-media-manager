<template>
  <div :class="[mode, { inset: inset }]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: "card",
    },
    inset: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 0.2rem;
  box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.26);
}

.flat {
  border: 0.1rem solid rgba(0, 0, 0, 0.2);
  border-radius: 0.2rem;
}
.inset {
  box-shadow: inset 0.3rem 0.3rem 0.5rem #4444442a,
    inset -0.3rem -0.3rem 0.5rem #4444442a;
}
</style>
