<template>
  <div
    class="outer"
    :class="{ 'outer-short': isShort, clickable: isClickable }"
    @click="handleUserClick()"
  >
    <div
      v-if="showBadge"
      class="badge-wrapper"
    >
      <div
        class="badge"
        :class="[user.isOnline ? 'badge--online' : 'badge--offline', { 'badge--favorite': isFavorite }]"
      ></div>
    </div>
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
    >
      {{ user.name }}
    </span>
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
    showBadge?: boolean;
    user: Pick<IUser, 'color' | 'icon' | 'id' | 'isOnline' | 'name'>;
  }>(),
  {
    isActive: false,
    isClickable: false,
    isFavorite: false,
    isShort: false,
    showBadge: false
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

.badge-wrapper {
  position: relative;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.badge {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &--online {
    @extend .badge;
    background-color: var(--bolao-c-mint);

    &::after {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      animation: ripple 2s infinite ease-in-out;
      border: 1px solid var(--bolao-c-mint);
      content: '';
    }

    &.badge--favorite {
      background-color: var(--bolao-c-gold);

      &::after {
        border-color: var(--bolao-c-gold);
      }
    }
  }

  &--offline {
    @extend .badge;
    background-color: transparent;
    opacity: 0.2;
    outline: 1.5px solid var(--bolao-c-grey3);
    outline-offset: 1px;

    &.badge--favorite {
      opacity: 1;
      outline: 1.5px solid var(--bolao-c-gold);
      outline-offset: 1px;
    }
  }
}
</style>
