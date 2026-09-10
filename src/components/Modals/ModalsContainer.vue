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
  <FleaflickerMatchModal
    :isOpen="isFleaflickerMatchModalOpen"
    :handleCloseModal="closeModal"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import FleaflickerMatchModal from '@/components/Modals/FleaflickerMatchModal.vue';
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
const { modalStack } = storeToRefs(modalsStore);
const { closeModal } = modalsStore;

function isOpen(modal: EModal) {
  return computed(() => modalStack.value.some((entry) => entry.modal === modal));
}

const isSeasonRegisterModalOpen = isOpen(EModal.SeasonRegister);
const isLoginModalOpen = isOpen(EModal.Login);
const isProfileModalOpen = isOpen(EModal.Profile);
const isPasswordModalOpen = isOpen(EModal.Password);
const isPreferencesModalOpen = isOpen(EModal.Preferences);
const isConfigModalOpen = isOpen(EModal.Config);
const isPlayerNewsModalOpen = isOpen(EModal.PlayerNews);
const isProjectedStatsModalOpen = isOpen(EModal.ProjectedStats);
const isUserTrackingModalOpen = isOpen(EModal.UserTracking);
const isMatchModalOpen = isOpen(EModal.Match);
const isFleaflickerMatchModalOpen = isOpen(EModal.FleaflickerMatch);

const { currentSeason } = storeToRefs(useConfigurationStore());
</script>
