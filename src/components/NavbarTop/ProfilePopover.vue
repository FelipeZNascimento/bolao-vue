<template>
  <PrimePopover ref="popover">
    <div class="outer-profile-popover">
      <PrimeButton
        v-if="activeProfile?.admin"
        variant="text"
        severity="warn"
        size="small"
        label="Admin"
        @click="navigate('/admin')"
      />
      <PrimeButton
        variant="text"
        severity="secondary"
        size="small"
        label="Perfil"
        @click="openModal(EModal.Profile)"
      />
      <PrimeButton
        variant="text"
        severity="secondary"
        size="small"
        label="Preferências"
        @click="openModal(EModal.Preferences)"
      />
      <PrimeButton
        variant="text"
        severity="secondary"
        size="small"
        @click="activeProfile?.fleaflicker ? navigate('/fleaflicker') : navigate('/fleaflicker', { tab: 'config' })"
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
        label="Trocar senha"
        @click="openModal(EModal.Password)"
      />
      <PrimeButton
        size="small"
        label="Sair"
        @click="handleLogout"
      />
      <p style="font-size: var(--xs-font-size); text-align: center">
        Saldo: {{ activeProfile?.balance?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
      </p>
    </div>
  </PrimePopover>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ActiveProfileService from '@/services/activeProfile';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { EModal, useModalsStore } from '@/stores/modals';

const popover = ref();
const router = useRouter();

const { activeProfile } = storeToRefs(useActiveProfileStore());
const { openModal } = useModalsStore();

const activeProfileService = new ActiveProfileService();

function navigate(path: string, query?: Record<string, string>) {
  popover.value.hide();
  router.push({ path, query });
}

function handleLogout() {
  activeProfileService.logout();
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
