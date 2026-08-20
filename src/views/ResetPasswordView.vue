<template>
  <div class="outer-reset">
    <div class="reset-card">
      <h1>Recuperar senha</h1>
      <Form
        noValidate
        :initialValues
        :resolver
        v-slot="$form"
        @submit="onFormSubmit"
      >
        <PrimeFloatLabel
          variant="in"
          class="input"
        >
          <PrimeInputText
            name="email"
            type="email"
            disabled
            fluid
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
          variant="in"
          class="input"
        >
          <PrimeInputText
            name="token"
            type="text"
            disabled
            fluid
          />
          <PrimeMessage
            v-if="$form.token?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.token.error?.message }}
          </PrimeMessage>
          <label for="token">Token</label>
        </PrimeFloatLabel>
        <PrimeFloatLabel
          variant="in"
          class="input"
        >
          <PrimePassword
            name="password"
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
          <label for="password">Nova senha</label>
        </PrimeFloatLabel>
        <PrimeButton
          type="submit"
          label="Confirmar"
          icon="pi pi-check"
          :loading="isLoading"
          fluid
        />
        <p
          v-if="error"
          class="error-message"
        >
          <PrimeTag
            severity="contrast"
            icon="pi pi-exclamation-triangle"
            :value="error?.message"
          />
        </p>
        <div
          v-if="success"
          class="success-message"
        >
          <PrimeTag
            severity="success"
            icon="pi pi-check"
            value="Senha alterada com sucesso!"
          />
          <p class="redirect-countdown">Redirecionando para a página inicial em {{ countdown }}s...</p>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';

// ------ Initialization ------
const route = useRoute();
const router = useRouter();
const userService = new UserService();
const activeProfileStore = useActiveProfileStore();

// ------ Refs ------
const success = ref(false);
const countdown = ref(10);
const initialValues = ref({
  email: String(route.query.email ?? ''),
  token: String(route.query.token ?? ''),
  password: ''
});

const resolver = ref(
  zodResolver(
    z.object({
      email: z.email({ error: 'Email inválido' }),
      token: z.string().min(1, { message: 'Token está vazio' }),
      password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
    })
  )
);

// ------ Computed ------
const isLoading = computed(() => activeProfileStore.isLoading);
const error = computed(() => activeProfileStore.error);

// ------ Functions ------
function startCountdown() {
  const interval = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(interval);
      router.push('/');
    }
  }, 1000);
}

function onFormSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  if (!formData.valid || !formData.values) return;
  const { token, email, password } = formData.values;
  userService.resetPassword(token, email, password, (isSuccess) => {
    if (isSuccess) {
      success.value = true;
      startCountdown();
    }
  });
}
</script>
<style lang="scss" scoped>
.outer-reset {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: var(--xxl-spacing) var(--l-spacing);
  flex: 1;
}

.reset-card {
  display: flex;
  flex-direction: column;
  gap: var(--l-spacing);
  width: 100%;
  max-width: 400px;

  h1 {
    font-size: var(--l-font-size);
    font-weight: 700;
  }
}

.input {
  padding-bottom: var(--m-spacing);
}

.error-message,
.success-message {
  text-align: center;
  padding-top: var(--s-spacing);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-spacing);
}

.redirect-countdown {
  font-size: var(--s-font-size);
  opacity: 0.7;
}
</style>
