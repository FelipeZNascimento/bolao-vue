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
  <BetsModal />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import BetsModal from '@/components/Match/BetsModal/BetsModal.vue';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useModalsStore } from '@/stores/modals';
import SeasonRegisterModal from './SeasonRegisterModal.vue';
import UserTrackingModal from './UserTrackingModal.vue';

const { activeProfile } = storeToRefs(useActiveProfileStore());

const modalsStore = useModalsStore();
const { isSeasonRegisterModalOpen, isUserTrackingModalOpen, selectedUserTracking } = storeToRefs(modalsStore);
const { closeSeasonRegisterModal, closeUserTrackingModal } = modalsStore;

const { currentSeason } = storeToRefs(useConfigurationStore());
</script>
