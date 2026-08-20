<template>
  <PrimeDialog
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    :closable="false"
    position="top"
    :style="{ width: '440px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h2>Nova Temporada</h2>
    </template>

    <div class="content">
      <p>
        Uma nova temporada começou! Você gostaria de se inscrever na nova temporada e continuar participando do Bolão?
      </p>
      <PrimeMessage
        v-if="error"
        severity="error"
        variant="outlined"
        class="error-message"
      >
        <p>{{ error?.message }}</p>
      </PrimeMessage>
    </div>

    <template #footer>
      <div class="footer-buttons">
        <PrimeButton
          label="Agora não"
          variant="outlined"
          severity="secondary"
          :disabled="isLoading"
          @click="handleDecline"
        />
        <PrimeButton
          label="Inscrever-me"
          :loading="isLoading"
          @click="handleRegister"
        />
      </div>
    </template>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';

const props = defineProps<{
  currentSeason: null | number;
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const isVisible = ref(false);

// ------ Initializations ------
const router = useRouter();
const userService = new UserService();
const activeProfileStore = useActiveProfileStore();
const { isLoading, error } = storeToRefs(activeProfileStore);

// ------ Functions ------
function handleRegister() {
  activeProfileStore.setError(null);
  userService.seasonRegister(async (isSuccess) => {
    if (isSuccess) {
      await router.push('/home');
      window.location.reload();
    }
  });
}

function handleDecline() {
  isVisible.value = false;
}

// ------ Watches ------
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      activeProfileStore.setError(null);
      isVisible.value = true;
    }
  }
);

watch(isVisible, (newValue) => {
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);

  p {
    margin: 0;
    line-height: 1.6;
  }
}

.error-message {
  margin-top: var(--s-spacing);
}

.footer-buttons {
  display: flex;
  justify-content: flex-end;
  gap: var(--m-spacing);
  width: 100%;
}
</style>
