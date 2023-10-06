<template>
  <button v-if="!link" :class="[mode, { inset: inset }]">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="[mode, { inset: inset }]">
    <slot> </slot>
  </router-link>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: null,
    },
    link: {
      type: Boolean,
      required: false,
      default: false,
    },
    to: {
      type: String,
      required: false,
      default: "/",
    },
    inset: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
button,
a {
  /* font-size: 14px; */

  text-decoration: none;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: $secondary-color;
  border: none;
  color: $background-color;
  cursor: pointer;
  transition: background-color 0.2s ease-out, color 0.2s ease-out;
}

a:hover,
a:active,
button:hover,
button:active {
  color: $background-color-white;
  background-color: $secondary-color-dark;
}

button.inset,
a.inset {
  color: $secondary-color;
  background: $background-color;
}

button:hover.inset,
button:active.inset {
  background-color: $secondary-color;
  color: $background-color;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0), 0 0 0 rgba(0, 0, 0, 0),
    inset 0.3rem 0.5rem 0.4rem $secondary-color-dark;
}
</style>
