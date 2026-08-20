<template>
  <div
    class="outer"
    :class="{ 'outer-short': isShort }"
  >
    <span
      class="usericon"
      :class="{ 'usericon--favorite': isFavorite }"
    >
      <FontAwesomeIcon
        :style="{ color: color }"
        :icon="icon"
      />
      <i
        v-if="isFavorite"
        class="pi pi-star-fill favorite-badge"
      />
    </span>
    <span
      class="username"
      :class="{ active: isActive }"
      >{{ name }}</span
    >
  </div>
</template>
<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

withDefaults(
  defineProps<{
    color: string;
    icon: string;
    isActive?: boolean;
    isFavorite?: boolean;
    isShort?: boolean;
    name: string;
  }>(),
  {
    isActive: false,
    isFavorite: false,
    isShort: false
  }
);
</script>
<style lang="scss" scoped>
.outer-short {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 120px;
}

.outer {
  display: flex;
  align-items: center;
  flex-direction: row;
}
.username {
  padding: 0 var(--s-spacing);
}

.usericon {
  position: relative;
  width: 20px;
}

.favorite-badge {
  position: absolute;
  bottom: 0px;
  right: -4px;
  font-size: 8px;
  color: var(--bolao-c-gold);
  pointer-events: none;
}

.active {
  font-weight: bold;
}
</style>
