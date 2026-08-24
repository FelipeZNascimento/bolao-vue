<template>
  <SeasonRegisterModal
    :isOpen="isSeasonRegisterModalOpen"
    :currentSeason="currentSeason"
    :handleCloseModal="closeSeasonRegisterModal"
  />
  <LoginModal
    :isOpen="isLoginModalOpen"
    :handleCloseModal="closeLoginModal"
  />
  <ProfileModal
    :isOpen="isProfileModalOpen"
    :handleCloseModal="closeProfileModal"
  />
  <PasswordModal
    :isOpen="isPasswordModalOpen"
    :handleCloseModal="closePasswordModal"
  />
  <PreferencesModal
    :isOpen="isPreferencesModalOpen"
    :handleCloseModal="closePreferencesModal"
  />
  <ConfigModal
    :isOpen="isConfigModalOpen"
    :handleCloseModal="closeConfigModal"
  />
  <FleaflickerModal
    :isOpen="isFleaflickerModalOpen"
    :handleCloseModal="closeFleaflickerModal"
  />
  <UserTrackingModal
    :isOpen="isUserTrackingModalOpen"
    :isUserActive="activeProfile?.id === selectedUserTracking?.id"
    :selectedUser="selectedUserTracking"
    :handleCloseModal="closeUserTrackingModal"
  />
  <BetsModal />
  <PlayerNewsModal
    :isOpen="isPlayerNewsModalOpen"
    :news="selectedPlayerNews"
    :handleCloseModal="closePlayerNewsModal"
  />
  <ProjectedStatsModal
    :isOpen="isProjectedStatsModalOpen"
    :player="selectedProjectedStats"
    :handleCloseModal="closeProjectedStatsModal"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import BetsModal from '@/components/Match/BetsModal/BetsModal.vue';
import PlayerNewsModal from '@/components/Modals/PlayerNewsModal.vue';
import ProjectedStatsModal from '@/components/Modals/ProjectedStatsModal.vue';
import ConfigModal from '@/components/NavbarTop/ConfigModal.vue';
import FleaflickerModal from '@/components/NavbarTop/FleaflickerModal.vue';
import LoginModal from '@/components/NavbarTop/LoginModal.vue';
import PasswordModal from '@/components/NavbarTop/PasswordModal.vue';
import PreferencesModal from '@/components/NavbarTop/PreferencesModal.vue';
import ProfileModal from '@/components/NavbarTop/ProfileModal.vue';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useModalsStore } from '@/stores/modals';
import SeasonRegisterModal from './SeasonRegisterModal.vue';
import UserTrackingModal from './UserTrackingModal.vue';

const { activeProfile } = storeToRefs(useActiveProfileStore());

const modalsStore = useModalsStore();
const {
  isSeasonRegisterModalOpen,
  isLoginModalOpen,
  isProfileModalOpen,
  isPasswordModalOpen,
  isPreferencesModalOpen,
  isConfigModalOpen,
  isFleaflickerModalOpen,
  isPlayerNewsModalOpen,
  selectedPlayerNews,
  isProjectedStatsModalOpen,
  selectedProjectedStats,
  isUserTrackingModalOpen,
  selectedUserTracking
} = storeToRefs(modalsStore);
const {
  closeSeasonRegisterModal,
  closeLoginModal,
  closeProfileModal,
  closePasswordModal,
  closePreferencesModal,
  closeConfigModal,
  closeFleaflickerModal,
  closePlayerNewsModal,
  closeProjectedStatsModal,
  closeUserTrackingModal
} = modalsStore;

const { currentSeason } = storeToRefs(useConfigurationStore());
</script>
