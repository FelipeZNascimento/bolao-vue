<template>
  <div
    class="outer"
    :class="{ 'outer-short': isShort, clickable: isClickable }"
    @click="handleUserClick()"
  >
    <span
      class="usericon"
      :class="{ 'usericon--favorite': isFavorite }"
    >
      <FontAwesomeIcon
        :style="{ color: user.color }"
        :icon="user.icon"
      />
      <i
        v-if="isFavorite"
        class="pi pi-star-fill favorite-badge"
      />
    </span>
    <span
      class="username"
      :class="{ active: isActive }"
      >{{ user.name }}</span
    >
  </div>
</template>
<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IUser } from '@/stores/activeProfile.types';
import { useModalsStore } from '@/stores/modals';

const props = withDefaults(
  defineProps<{
    isActive?: boolean;
    isFavorite?: boolean;
    isShort?: boolean;
    isClickable?: boolean;
    user: Pick<IUser, 'color' | 'icon' | 'id' | 'isOnline' | 'name'>;
  }>(),
  {
    isActive: false,
    isClickable: false,
    isFavorite: false,
    isShort: false
  }
);

const { openUserTrackingModal } = useModalsStore();

function handleUserClick() {
  if (!props.isClickable) return;
  openUserTrackingModal(props.user);
}
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

.clickable {
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
}
</style>
