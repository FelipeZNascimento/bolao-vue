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
                :user="activeProfile"
                :showOnlineBadge="false"
              />
            </PrimeButton>
            <PrimeButton
              v-else
              icon="pi pi-user"
              :loading="isProfileLoading"
              label="Login"
              @click="openModal(EModal.Login)"
            />
            <a @click="openModal(EModal.Config)"><i class="pi pi-cog"></i></a>
          </div>
          <ProfilePopover ref="profilePopover" />
        </template>
      </PrimeMenubar>
    </nav>
  </header>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { EModal, useModalsStore } from '@/stores/modals';
import IconAndName from '../IconAndName.vue';
import ProfilePopover from './ProfilePopover.vue';
import { ROUTES } from './routes';

// ------ Refs ------
const isDarkMode = ref(false);
const profilePopover = ref<InstanceType<typeof ProfilePopover>>();
const activeRoute = ref(ROUTES[0].id);

// ------ Initializations ------
const configurationStore = useConfigurationStore();
const activeProfileStore = useActiveProfileStore();
isDarkMode.value = configurationStore.isDarkMode();
onMounted(() => {
  const currentPath = window.location.pathname;
  const matchingRoute = ROUTES.find((route) => route.url === currentPath);
  if (matchingRoute) {
    activeRoute.value = matchingRoute.id;
  }
});

const { activeProfile, isLoading: isProfileLoading } = storeToRefs(activeProfileStore);
const modalsStore = useModalsStore();
const { openModal } = modalsStore;
const { currentSeason } = storeToRefs(configurationStore);

// ------ Computed Properties ------
const filteredRoutes = computed(() =>
  ROUTES.filter((route) => (route.needCredentials ? activeProfile.value !== null : true))
);

// ------ Watches ------
watch(activeProfile, (profile) => {
  if (profile && currentSeason.value !== null && profile.seasonId !== currentSeason.value) {
    openModal(EModal.SeasonRegister);
  }
});

// ------ Functions ------
function togglePopover(event: Event) {
  profilePopover.value?.toggle(event);
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
  width: var(--page-width);
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

  @media (max-width: 1280px) {
    font-size: var(--m-font-size) !important;
  }

  .p-menubar {
    --p-menubar-mobile-button-size: 2.5rem;
    --p-icon-size: 1.5rem;
    border: none;
    height: 100%;
    border-radius: 0;
    background-color: var(--bolao-c-navbar);
    width: 100%;

    .p-menubar-end {
      flex: 0 !important;
    }
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
</style>
