<template>
  <div
    class="outer"
    :class="{ 'outer-short': isShort, clickable: isClickable }"
    @click="handleUserClick()"
  >
    <div
      class="badge-wrapper"
      v-if="showOnlineBadge"
    >
      <div
        class="badge"
        :class="[{ 'badge--online': user.isOnline, 'badge--favorite': isFavorite }]"
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
import { EModal, useModalsStore } from '@/stores/modals';

const props = withDefaults(
  defineProps<{
    isActive?: boolean;
    isFavorite?: boolean;
    isShort?: boolean;
    isClickable?: boolean;
    showIcon?: boolean;
    showOnlineBadge?: boolean;
    user: Pick<IUser, 'color' | 'icon' | 'id' | 'isOnline' | 'name'>;
  }>(),
  {
    isActive: false,
    isClickable: false,
    isFavorite: false,
    isShort: false,
    showIcon: true,
    showOnlineBadge: true
  }
);

const { openModal } = useModalsStore();

function handleUserClick() {
  if (!props.isClickable) return;
  openModal(EModal.UserTracking, [props.user]);
}
</script>
<style lang="scss" scoped>
.outer-short {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 120px;
  max-width: 100%;
}

.outer {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: var(--xs-spacing);
}
.username {
  padding: 0 var(--s-spacing);
  @media (max-width: 1023px) {
    padding: 0;
  }
}

.usericon {
  position: relative;
  width: 20px;

  @media (max-width: 1023px) {
    width: 16px;
  }
}

.favorite-badge {
  position: absolute;
  bottom: 0px;
  right: -4px;
  font-size: 8px;
  color: var(--bolao-c-gold);
  pointer-events: none;

  @media (max-width: 1023px) {
    font-size: 6px;
    left: 8px;
  }
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
}
</style>
