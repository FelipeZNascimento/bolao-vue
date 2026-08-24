<template>
  <PrimePopover ref="popover">
    <div class="outer-profile-popover">
      <PrimeButton
        v-if="activeProfile?.admin"
        variant="text"
        severity="warn"
        size="small"
        label="Admin"
        @click="$router.push('/admin')"
      />
      <PrimeButton
        variant="text"
        severity="secondary"
        size="small"
        label="Perfil"
        @click="openProfileModal"
      />
      <PrimeButton
        variant="text"
        severity="secondary"
        size="small"
        label="Preferências"
        @click="openPreferencesModal"
      />
      <PrimeButton
        v-if="activeProfile?.fleaflicker"
        variant="text"
        severity="secondary"
        size="small"
        @click="$router.push('/fleaflicker')"
      >
        <img
          src="/fleaflicker.png"
          alt="Fleaflicker"
          class="fleaflicker-logo"
        />
        Fleaflicker
      </PrimeButton>
      <PrimeButton
        v-else
        variant="text"
        severity="secondary"
        size="small"
        @click="openFleaflickerModal"
      >
        <img
          src="/fleaflicker.png"
          alt="Fleaflicker"
          class="fleaflicker-logo"
        />
        Fleaflicker
      </PrimeButton>
      <PrimeButton
        variant="text"
        severity="danger"
        size="small"
        label="Senha"
        @click="openPasswordModal"
      />
      <PrimeButton
        size="small"
        label="Sair"
        @click="handleLogout"
      />
    </div>
  </PrimePopover>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useModalsStore } from '@/stores/modals';

const popover = ref();

const { activeProfile } = storeToRefs(useActiveProfileStore());
const { openProfileModal, openPasswordModal, openPreferencesModal, openFleaflickerModal } = useModalsStore();

const userService = new UserService();

function handleLogout() {
  userService.logout();
  popover.value.toggle();
}

function toggle(event: Event) {
  popover.value.toggle(event);
}

defineExpose({ toggle });
</script>
<style lang="scss" scoped>
.outer-profile-popover {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
}

.fleaflicker-logo {
  width: 16px;
  height: 16px;
  object-fit: contain;
}
</style>
