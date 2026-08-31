<template>
  <SeasonRegisterModal
    :isOpen="isSeasonRegisterModalOpen"
    :currentSeason="currentSeason"
    :handleCloseModal="closeModal"
  />
  <LoginModal
    :isOpen="isLoginModalOpen"
    :handleCloseModal="closeModal"
  />
  <ProfileModal
    :isOpen="isProfileModalOpen"
    :handleCloseModal="closeModal"
  />
  <PasswordModal
    :isOpen="isPasswordModalOpen"
    :handleCloseModal="closeModal"
  />
  <PreferencesModal
    :isOpen="isPreferencesModalOpen"
    :handleCloseModal="closeModal"
  />
  <ConfigModal
    :isOpen="isConfigModalOpen"
    :handleCloseModal="closeModal"
  />
  <UserTrackingModal
    :isOpen="isUserTrackingModalOpen"
    :handleCloseModal="closeModal"
  />
  <MatchModal
    :isOpen="isMatchModalOpen"
    :handleCloseModal="closeModal"
  />
  <PlayerNewsModal
    :isOpen="isPlayerNewsModalOpen"
    :handleCloseModal="closeModal"
  />
  <ProjectedStatsModal
    :isOpen="isProjectedStatsModalOpen"
    :handleCloseModal="closeModal"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import PlayerNewsModal from '@/components/Modals/PlayerNewsModal.vue';
import ProjectedStatsModal from '@/components/Modals/ProjectedStatsModal.vue';
import ConfigModal from '@/components/NavbarTop/ConfigModal.vue';
import LoginModal from '@/components/NavbarTop/LoginModal.vue';
import PasswordModal from '@/components/NavbarTop/PasswordModal.vue';
import PreferencesModal from '@/components/NavbarTop/PreferencesModal.vue';
import ProfileModal from '@/components/NavbarTop/ProfileModal.vue';
import { useConfigurationStore } from '@/stores/configuration';
import { EModal, useModalsStore } from '@/stores/modals';
import MatchModal from '@/views/Match/MatchModal/MatchModal.vue';
import SeasonRegisterModal from './SeasonRegisterModal.vue';
import UserTrackingModal from './UserTrackingModal.vue';

const modalsStore = useModalsStore();
const { currentModal } = storeToRefs(modalsStore);
const { closeModal } = modalsStore;

const isSeasonRegisterModalOpen = computed(() => currentModal.value === EModal.SeasonRegister);
const isLoginModalOpen = computed(() => currentModal.value === EModal.Login);
const isProfileModalOpen = computed(() => currentModal.value === EModal.Profile);
const isPasswordModalOpen = computed(() => currentModal.value === EModal.Password);
const isPreferencesModalOpen = computed(() => currentModal.value === EModal.Preferences);
const isConfigModalOpen = computed(() => currentModal.value === EModal.Config);
const isPlayerNewsModalOpen = computed(() => currentModal.value === EModal.PlayerNews);
const isProjectedStatsModalOpen = computed(() => currentModal.value === EModal.ProjectedStats);
const isUserTrackingModalOpen = computed(() => currentModal.value === EModal.UserTracking);
const isMatchModalOpen = computed(() => currentModal.value === EModal.Match);

const { currentSeason } = storeToRefs(useConfigurationStore());
</script>
