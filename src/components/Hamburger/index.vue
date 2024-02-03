<template>
  <div class="menu-collapse" @click="toggleClick">
    <div class="menu-collapse_circle">
      <svg
        :class="{ 'is-active': isActive }"
        class="hamburger"
        t="1706492086074"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1816"
        width="32"
        height="32"
      >
        <path
          d="M542.165333 183.168a42.666667 42.666667 0 0 1 0 60.330667L273.664 512l268.501333 268.501333a42.666667 42.666667 0 0 1-60.330666 60.330667l-298.666667-298.666667a42.666667 42.666667 0 0 1 0-60.330666l298.666667-298.666667a42.666667 42.666667 0 0 1 60.330666 0z"
          p-id="1817"
        ></path>
        <path
          d="M840.832 183.168a42.666667 42.666667 0 0 1 0 60.330667L572.330667 512l268.501333 268.501333a42.666667 42.666667 0 0 1-60.330667 60.330667l-298.666666-298.666667a42.666667 42.666667 0 0 1 0-60.330666l298.666666-298.666667a42.666667 42.666667 0 0 1 60.330667 0z"
          p-id="1818"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { propTypes } from '@/utils/propTypes';

defineProps({
  isActive: propTypes.bool.def(false)
})

const emit = defineEmits(['toggleClick'])
const toggleClick = () => {
  emit('toggleClick');
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.module.scss';


.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 12px;
  height: 12px;

  &:hover {
    fill: $--color-primary;
  }
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
