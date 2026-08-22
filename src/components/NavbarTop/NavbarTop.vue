<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <header>
    <nav>
      <PrimeMenubar :model="filteredRoutes">
        <template #start>
          <RouterLink to="/home">
            <img
              class="logo-image"
              src="/src/img/logo.png"
              :alt="`Bolao NFL logo`"
            />
          </RouterLink>
        </template>
        <template #item="{ item }">
          <RouterLink
            v-if="item.url"
            :to="item.url"
            :class="{
              disabled: item.needCredentials && !activeProfile,
              enabled: !item.needCredentials || activeProfile,
              active: item.id === activeRoute
            }"
            v-slot="{ navigate }"
            @click="activeRoute = item.id"
            custom
          >
            <a @click="navigate()">
              <span>{{ item.label }}</span>
            </a>
          </RouterLink>
        </template>
        <template #end>
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
              <PrimeButton
                size="small"
                label="Sair"
                @click="handleLogout"
              />
            </div>
          </PrimePopover>
        </template>
      </PrimeMenubar>
    </nav>
  </header>
  <LoginModal
    :isOpen="isLoginModalOpen"
    :handleCloseModal="() => (isLoginModalOpen = false)"
  />
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
  <ConfigModal
    :isOpen="isConfigModalOpen"
    :handleCloseModal="() => (isConfigModalOpen = false)"
  />
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import ConfigModal from '@/components/NavbarTop/ConfigModal.vue';
import LoginModal from '@/components/NavbarTop/LoginModal.vue';
import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import IconAndName from '../IconAndName.vue';
import PasswordModal from './PasswordModal.vue';
import PreferencesModal from './PreferencesModal.vue';
import ProfileModal from './ProfileModal.vue';
import { ROUTES } from './routes';

// ------ Refs ------
const isDarkMode = ref(false);
const isLoginModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const isPreferencesModalOpen = ref(false);
const profilePopover = ref();
const isConfigModalOpen = ref(false);
const activeRoute = ref(ROUTES[0].id);

// ------ Initializations ------
const configurationStore = useConfigurationStore();
const activeProfileStore = useActiveProfileStore();
isDarkMode.value = configurationStore.isDarkMode();
const userService = new UserService();
onMounted(() => {
  const currentPath = window.location.pathname;
  const matchingRoute = ROUTES.find((route) => route.url === currentPath);
  if (matchingRoute) {
    activeRoute.value = matchingRoute.id;
  }
});

const { activeProfile, isLoading: isProfileLoading, isSeasonRegisterModalOpen } = storeToRefs(activeProfileStore);
const { currentSeason } = storeToRefs(configurationStore);

// ------ Computed Properties ------
const filteredRoutes = computed(() =>
  ROUTES.filter((route) => (route.needCredentials ? activeProfile.value !== null : true))
);

// ------ Watches ------
watch(activeProfile, (profile) => {
  if (profile && currentSeason.value !== null && profile.seasonId !== currentSeason.value) {
    isSeasonRegisterModalOpen.value = true;
  }
});

// ------ Functions ------
function handleLogout() {
  userService.logout();
  profilePopover.value.toggle();
}

function togglePopover(event: Event) {
  profilePopover.value.toggle(event);
}
</script>
<style lang="scss" scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: var(--bolao-c-navbar);
  box-shadow: 0 0 15px 1px #0006;
  width: 100%;
  flex: 0;

  @media (min-width: 1024px) {
    display: flex;
    place-items: center;
    align-items: center;
    justify-content: center;
  }
}

nav {
  font-size: 24px;
  text-align: center;
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;

  .p-menubar {
    --p-menubar-mobile-button-size: 2.5rem;
    --p-icon-size: 1.5rem;
    border: none;
    height: 100%;
    border-radius: 0;
    background-color: var(--bolao-c-navbar);
    width: var(--page-width);
  }

  i {
    transition: all 0.2s;
    font-size: var(--m-font-size);

    &:hover {
      color: var(--color-contrast);
    }
  }

  .logo-image {
    max-height: 50px;
  }

  a {
    display: inline-block;
    transition: 0.2s;
    color: var(--nav-link);

    @media (max-width: 1023px) {
      padding: 0;
    }

    @media (min-width: 1024px) {
      padding: 0 var(--m-spacing);
    }
  }
}

.outer-right {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--m-spacing);
}

.active {
  color: var(--bolao-c-gold);
}

.enabled {
  &:hover {
    color: var(--nav-link-hover);
    background-color: transparent !important;
  }
}

.disabled {
  cursor: default;
  pointer-events: none;
  color: var(--nav-disabled);
}

.outer-profile-popover {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
}
</style>
