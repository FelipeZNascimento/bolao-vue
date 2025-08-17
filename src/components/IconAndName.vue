<template>
  <div :class="{ outer: isShort }">
    <span class="usericon">
      <FontAwesomeIcon :style="{ color: color }" :icon="icon" />
    </span>
    <span class="username" :class="{ active: isActive }">{{ name }}</span>
  </div>
</template>
<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps<{
  color: string;
  icon: string;
  name: string;
  isActive?: boolean;
  isShort?: boolean;
}>();
</script>
<style lang="scss" scoped>
.outer {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 120px;
}
.username {
  padding: 0 var(--s-spacing);
}

.usericon {
  width: 20px;
}

.active {
  font-weight: bold;
}
</style>
