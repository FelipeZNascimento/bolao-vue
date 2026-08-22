<template>
  <SeasonRegisterModal
    :isOpen="isSeasonRegisterModalOpen"
    :currentSeason="currentSeason"
    :handleCloseModal="closeSeasonRegisterModal"
  />
  <UserTrackingModal
    :isOpen="isUserTrackingModalOpen"
    :isUserActive="activeProfile?.id === selectedUserTracking?.id"
    :selectedUser="selectedUserTracking"
    :handleCloseModal="closeUserTrackingModal"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import SeasonRegisterModal from './SeasonRegisterModal.vue';
import UserTrackingModal from './UserTrackingModal.vue';

const activeProfileStore = useActiveProfileStore();
const {
  activeProfile,
  isSeasonRegisterModalOpen,
  isUserTrackingModalOpen,
  selectedUserTracking
} = storeToRefs(activeProfileStore);
const { closeSeasonRegisterModal, closeUserTrackingModal } = activeProfileStore;

const { currentSeason } = storeToRefs(useConfigurationStore());
</script>
