<template>
  <PrimeDialog
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    position="top"
    :style="{ width: '400px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h2>{{ modalTitle }}</h2>
    </template>
    <Form
      noValidate
      :initialValues
      :resolver="currentResolver"
      v-slot="$form"
      @submit="(formData) => onFormSubmit(formData)"
    >
      <PrimeFloatLabel
        variant="in"
        class="input"
      >
        <PrimeInputText
          name="email"
          type="email"
          fluid
          autofocus
        />
        <PrimeMessage
          v-if="$form.email?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.email.error?.message }}
        </PrimeMessage>
        <label for="email">Email</label>
      </PrimeFloatLabel>
      <PrimeFloatLabel
        v-if="mode !== 'forgotPassword'"
        variant="in"
        class="input"
      >
        <PrimePassword
          name="password"
          type="password"
          :feedback="false"
          toggleMask
          fluid
        />
        <PrimeMessage
          v-if="$form.password?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.password.error?.message }}
        </PrimeMessage>
        <label for="password">Senha</label>
      </PrimeFloatLabel>
      <PrimeFloatLabel
        v-if="mode === 'signup'"
        variant="in"
        class="input"
      >
        <PrimeInputText
          name="name"
          type="text"
          fluid
        />
        <PrimeMessage
          v-if="$form.name?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.name.error?.message }}
        </PrimeMessage>
        <label for="name">Nome Completo</label>
      </PrimeFloatLabel>
      <PrimeFloatLabel
        v-if="mode === 'signup'"
        variant="in"
        class="input"
      >
        <PrimeInputText
          name="username"
          type="text"
          fluid
        />
        <PrimeMessage
          v-if="$form.username?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.username.error?.message }}
        </PrimeMessage>
        <label for="username">Usuário</label>
      </PrimeFloatLabel>
      <div class="buttons-container">
        <PrimeButton
          v-if="mode === 'login'"
          :disabled="isLoading"
          label="Esqueci a senha"
          variant="text"
          severity="secondary"
          @click="setMode('forgotPassword')"
        />
        <PrimeButton
          v-if="mode === 'forgotPassword'"
          :disabled="isLoading"
          label="Voltar ao login"
          variant="text"
          severity="secondary"
          @click="setMode('login')"
        />
        <PrimeButton
          type="submit"
          label="Confirmar"
          variant="primary"
          severity="primary"
          icon="pi pi-check"
          :loading="isLoading"
        />
      </div>
      <p
        style="text-align: center; padding-top: var(--l-spacing)"
        v-show="loginError"
      >
        <PrimeTag
          severity="contrast"
          icon="pi pi-exclamation-triangle"
          :value="loginError?.message"
        />
      </p>
    </Form>
    <template
      v-if="mode === 'signup'"
      #footer
    >
      <PrimeButton
        @click="setMode('login')"
        class="signup-button"
        type="submit"
        label="Voltar ao login"
        variant="text"
        severity="secondary"
        icon="pi pi-check"
        :disabled="isLoading"
      />
    </template>
    <template
      v-else-if="mode === 'login'"
      #footer
    >
      <PrimeButton
        @click="setMode('signup')"
        class="signup-button"
        type="submit"
        label="Faça aqui o seu cadastro"
        variant="primary"
        severity="secondary"
        icon="pi pi-check"
        :disabled="isLoading"
      />
    </template>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { computed, ref, watch } from 'vue';
import { z } from 'zod';
import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

type Mode = 'login' | 'signup' | 'forgotPassword';

// ------ Refs ------
const isVisible = ref(false);
const mode = ref<Mode>('login');
const initialValues = ref({
  email: '',
  name: '',
  password: '',
  username: ''
});

const loginResolver = ref(
  zodResolver(
    z.object({
      email: z.email({ error: 'Email inválido' }),
      password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
    })
  )
);

const signupResolver = ref(
  zodResolver(
    z.object({
      email: z.email({ error: 'Email inválido' }),
      name: z.string().min(1, { message: 'Nome está vazio' }),
      password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
      username: z
        .string()
        .min(6, { message: 'Usuário tem que ter entre 6 e 12 caracteres' })
        .max(12, { message: 'Usuário tem que ter entre 6 e 12 caracteres' })
    })
  )
);

const forgotPasswordResolver = ref(
  zodResolver(
    z.object({
      email: z.email({ error: 'Email inválido' })
    })
  )
);

// ------ Initializations ------
const userService = new UserService();
const activeProfileStore = useActiveProfileStore();
const toast = useToast();

// ------ Computed Properties ------
const isLoading = computed(() => activeProfileStore.isLoading);
const loginError = computed(() => activeProfileStore.error);
const modalTitle = computed(() => {
  if (mode.value === 'signup') return 'Cadastro';
  if (mode.value === 'forgotPassword') return 'Recuperar senha';
  return 'Login';
});
const currentResolver = computed(() => {
  if (mode.value === 'signup') return signupResolver.value;
  if (mode.value === 'forgotPassword') return forgotPasswordResolver.value;
  return loginResolver.value;
});

// ------ Functions  ------
function setMode(newMode: Mode) {
  mode.value = newMode;
  activeProfileStore.setError(null);
}

function loginCallback(isSuccess: boolean) {
  if (isSuccess) {
    isVisible.value = false;
    props.handleCloseModal();
  }
}

function forgotPasswordCallback(isSuccess: boolean) {
  if (isSuccess) {
    isVisible.value = false;
    toast.add({
      detail: 'Se o email existir na nossa base, você receberá um link para redefinir sua senha.',
      life: 6000,
      severity: 'success',
      summary: 'Email enviado'
    });
  }
}

function onFormSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  if (mode.value === 'signup') {
    onSignupSubmit(formData);
  } else if (mode.value === 'forgotPassword') {
    onForgotPasswordSubmit(formData);
  } else {
    onLoginSubmit(formData);
  }
}

function onLoginSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  if (!formData.valid || !formData.values) return;
  activeProfileStore.setError(null);
  const { email, password } = formData.values;
  userService.login(email, password, loginCallback);
}

function onSignupSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  if (!formData.valid || !formData.values) return;
  const { email, name, password, username } = formData.values;
  userService.signup(email, password, name, username, loginCallback);
}

function onForgotPasswordSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  if (!formData.valid || !formData.values) return;
  const { email } = formData.values;
  userService.forgotPassword(email, forgotPasswordCallback);
}

function resetState() {
  mode.value = 'login';
  activeProfileStore.setError(null);
}

// ------ Watches  ------
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  }
);

watch(isVisible, async (newValue) => {
  if (!newValue) {
    resetState();
    props.handleCloseModal();
  }
});
</script>
<style scoped>
.input {
  padding-bottom: var(--m-spacing);
}
.buttons-container {
  display: flex;
  justify-content: center;
  gap: var(--m-spacing);
}

.signup-button {
  width: 100%;
}
</style>
