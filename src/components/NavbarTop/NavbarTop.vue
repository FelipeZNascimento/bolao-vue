<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <header>
    <nav>
      <img src="/src/img/logo.png" />
      <RouterLink
        v-for="route in ROUTES"
        activeClass="active"
        :to="route.url"
        :key="route.id"
        :class="{
          disabled: route.needCredentials && !activeProfile,
          enabled: !route.needCredentials,
        }"
      >
        {{ route.display }}
      </RouterLink>
      <div class="outer-right">
        <PrimeButton
          icon="pi pi-user"
          :loading="isProfileLoading"
          v-if="activeProfile"
          @click="togglePopover"
          :label="activeProfile.name"
          variant="outlined"
          severity="secondary"
        >
          <IconAndName
            :color="activeProfile.color"
            :icon="activeProfile.icon"
            :name="activeProfile.name"
          />
        </PrimeButton>
        <PrimeButton
          v-else
          icon="pi pi-user"
          :loading="isProfileLoading"
          label="Login"
          @click="isLoginModalOpen = true"
        />
        <a @click="isConfigModalOpen = true"><i class="pi pi-cog"></i></a>
      </div>
      <PrimePopover ref="profilePopover">
        <div class="outer-profile-popover">
          <PrimeButton
            variant="text"
            severity="secondary"
            size="small"
            label="Perfil"
            @click="isProfileModalOpen = true"
          />
          <PrimeButton
            variant="text"
            severity="secondary"
            size="small"
            label="Preferências"
            @click="isPreferencesModalOpen = true"
          />
          <PrimeButton
            variant="text"
            severity="danger"
            size="small"
            label="Senha"
            @click="isPasswordModalOpen = true"
          />
          <PrimeButton size="small" label="Sair" @click="handleLogout" />
        </div>
      </PrimePopover>
    </nav>
  </header>
  <LoginModal :isOpen="isLoginModalOpen" :handleCloseModal="() => (isLoginModalOpen = false)" />
  <ProfileModal
    :isOpen="isProfileModalOpen"
    :handleCloseModal="() => (isProfileModalOpen = false)"
  />
  <PasswordModal
    :isOpen="isPasswordModalOpen"
    :handleCloseModal="() => (isPasswordModalOpen = false)"
  />
  <PreferencesModal
    :isOpen="isPreferencesModalOpen"
    :handleCloseModal="() => (isPreferencesModalOpen = false)"
  />
  <ConfigModal :isOpen="isConfigModalOpen" :handleCloseModal="() => (isConfigModalOpen = false)" />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { ROUTES } from './routes';
import LoginModal from '@/components/NavbarTop/LoginModal.vue';
import { useActiveProfileStore } from '@/stores/activeProfile';
import UserService from '@/services/user';
import { useConfigurationStore } from '@/stores/configuration';
import IconAndName from '../IconAndName.vue';
import ProfileModal from './ProfileModal.vue';
import PasswordModal from './PasswordModal.vue';
import PreferencesModal from './PreferencesModal.vue';
import ConfigModal from '@/components/Ranking/ConfigModal.vue';

// ------ Refs ------
const isDarkMode = ref(false);
const isLoginModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const isPreferencesModalOpen = ref(false);
const profilePopover = ref();
const isConfigModalOpen = ref(false);

// ------ Initializations ------
const configurationStore = useConfigurationStore();
const activeProfileStore = useActiveProfileStore();
configurationStore.initialize();
isDarkMode.value = configurationStore.isDarkMode();

// ------ Computed Properties ------
const activeProfile = computed(() => activeProfileStore.activeProfile);
const isProfileLoading = computed(() => activeProfileStore.isLoading);
const userService = new UserService();

// ------ Functions ------
function handleLogout() {
  userService.logout();
  profilePopover.value.toggle();
}

function togglePopover(event) {
  profilePopover.value.toggle(event);
}
</script>
<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  position: sticky;
  top: 0;
  z-index: 999;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    background-color: var(--bolao-c-navbar);
    box-shadow: 0 0 15px 1px #0006;
  }
}

img {
  max-height: 60px;
}
nav {
  width: 100%;
  font-size: 24px;
  text-align: center;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  position: sticky;
  top: 0;
}

nav a {
  display: inline-block;
  padding: 0 12px;
  transition: 0.2s;
  color: var(--nav-link);
}

.outer-right {
  flex: 1;
  text-align: right;
}

.active {
  color: var(--bolao-c-gold);
}

.enabled {
  &:hover {
    color: var(--nav-link-hover);
  }
}

.disabled {
  cursor: default;
  pointer-events: none;
  color: var(--nav-disabled);
}

i {
  transition: all 0.2s;
  font-size: var(--m-font-size);

  &:hover {
    color: var(--color-contrast);
  }
}

.prime-dialog {
  width: 400px;
}

.outer-profile-popover {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
}
</style>
