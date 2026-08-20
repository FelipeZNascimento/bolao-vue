<template>
  <div class="home">
    <!-- ── Hero ── -->
    <section class="hero">
      <div class="hero-content">
        <img
          class="hero-logo"
          :class="{
            'hero-logo--dropping': logoDropping,
            'hero-logo--settled': logoSettled,
            'hero-logo--hovered': logoHovered
          }"
          src="/src/img/logo.png"
          alt="BolãoNFL logo"
          @mouseenter="onLogoHover"
        />
        <h1 class="hero-title">BolãoNFL</h1>
        <p class="hero-subtitle">
          Acompanhe cada jogo da temporada da NFL em tempo real, aposte nos resultados semana a semana e dispute com
          seus amigos no ranking geral.
        </p>
        <div class="hero-actions">
          <RouterLink to="/jogos">
            <PrimeButton
              label="Ver jogos"
              icon="pi pi-american-football"
              size="large"
            />
          </RouterLink>
          <RouterLink to="/regras">
            <PrimeButton
              label="Como funciona"
              icon="pi pi-info-circle"
              size="large"
              severity="secondary"
            />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── Feature cards ── -->
    <section class="features">
      <div
        class="feature-card"
        v-for="f in features"
        :key="f.title"
      >
        <i :class="`pi ${f.icon} feature-icon`" />
        <h3>{{ f.title }}</h3>
        <p>{{ f.description }}</p>
      </div>
    </section>

    <!-- ── How it works ── -->
    <section class="how-it-works">
      <h2 class="section-title">Como funciona</h2>
      <ol class="steps">
        <li
          class="step"
          v-for="(step, i) in steps"
          :key="i"
        >
          <span class="step-number">{{ i + 1 }}</span>
          <div>
            <strong>{{ step.title }}</strong>
            <p>{{ step.description }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- ── Coming soon ── -->
    <section class="coming-soon">
      <h2 class="section-title">Em breve</h2>
      <div class="soon-grid">
        <div
          class="soon-card"
          v-for="item in comingSoon"
          :key="item.title"
        >
          <i :class="`pi ${item.icon}`" />
          <span>{{ item.title }}</span>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="cta">
      <p>Pronto para apostar?</p>
      <div class="cta-links">
        <RouterLink to="/jogos">
          <PrimeButton
            label="Acessar jogos"
            icon="pi pi-play"
          />
        </RouterLink>
        <a
          href="https://t.me/+SvMGiAUj4m2FZge4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PrimeButton
            label="Entrar no Telegram"
            severity="secondary"
            variant="outlined"
          >
            <template #icon>
              <font-awesome-icon :icon="['fab', 'telegram']" />
            </template>
          </PrimeButton>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const logoDropping = ref(false);
const logoSettled = ref(false);
const logoHovered = ref(false);

onMounted(() => {
  setTimeout(() => {
    logoDropping.value = true;
    setTimeout(() => {
      logoDropping.value = false;
      logoSettled.value = true;
    }, 700);
  }, 200);
});

function onLogoHover() {
  if (!logoSettled.value || logoHovered.value) return;
  logoHovered.value = true;
  setTimeout(() => {
    logoHovered.value = false;
  }, 500);
}

const features = [
  {
    icon: 'pi-bolt',
    title: 'Tempo Real',
    description: 'Placares atualizados ao vivo via WebSocket — sem precisar recarregar a página.'
  },
  {
    icon: 'pi-chart-bar',
    title: 'Ranking Semanal & Geral',
    description: 'Acompanhe sua posição semana a semana e na temporada completa, incluindo playoffs e Super Bowl.'
  },
  {
    icon: 'pi-star',
    title: 'Apostas Extras',
    description: 'Além dos jogos, aposte nos campeões de divisão, conferência e no vencedor do Super Bowl.'
  },
  {
    icon: 'pi-users',
    title: 'Grupo de amigos',
    description: 'Crie seu perfil, escolha seu ícone e cor, e dispute com todo o grupo ao longo da temporada.'
  }
];

const steps = [
  { title: 'Crie sua conta', description: 'Registre-se e personalize seu perfil com nome, ícone e cor favorita.' },
  {
    title: 'Aposte nos jogos da semana',
    description: 'Antes do kickoff, escolha o placar que você acha que vai acontecer em cada partida.'
  },
  {
    title: 'Acompanhe ao vivo',
    description: 'Veja os placares sendo atualizados em tempo real e torça pelo seu palpite.'
  },
  {
    title: 'Acumule pontos',
    description: 'Acertar o vencedor e a margem correta vale 10 pts, acertar apenas o vencedor vale 5 pts.'
  }
];

const comingSoon = [
  { icon: 'pi-trophy', title: 'Histórico de temporadas' },
  { icon: 'pi-chart-line', title: 'Estatísticas pessoais por temporada' },
  { icon: 'pi-bell', title: 'Notificações para avisar de apostas abertas' },
  { icon: 'pi-calendar', title: 'Visualização por semana no calendário' }
];
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--xxxl-spacing);
  padding: var(--xxl-spacing) var(--l-spacing);
  max-width: 900px;
  margin: 0 auto;
}

.hero {
  display: flex;
  justify-content: center;
  padding: var(--xxl-spacing) 0;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--l-spacing);
  text-align: center;
  max-width: 680px;
}

.hero-logo {
  width: 96px;
  height: 96px;
  object-fit: contain;
  opacity: 0;
  cursor: pointer;

  &--dropping {
    animation: helmet-drop 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  &--settled {
    opacity: 1;
    transform: none;
  }
  &--settled.hero-logo--hovered {
    animation: helmet-kick 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
  }
}

@keyframes helmet-drop {
  0% {
    opacity: 0;
    transform: translateY(-80px) rotate(-30deg) scale(0.8);
  }
  60% {
    opacity: 1;
    transform: translateY(10px) rotate(6deg) scale(1.05);
  }
  80% {
    transform: translateY(-6px) rotate(-3deg) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(0deg) scale(1);
  }
}

@keyframes helmet-kick {
  0% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
  15% {
    opacity: 1;
    transform: rotate(-12deg) scale(1.08);
  }
  35% {
    opacity: 1;
    transform: rotate(14deg) scale(1.1);
  }
  55% {
    opacity: 1;
    transform: rotate(-8deg) scale(1.05);
  }
  75% {
    opacity: 1;
    transform: rotate(5deg) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
}

.hero-title {
  font-size: var(--xxl-font-size);
  font-weight: 800;
  color: var(--color-heading);
  letter-spacing: -1px;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: var(--m-font-size);
  color: var(--bolao-c-grey4);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: var(--l-spacing);
  flex-wrap: wrap;
  justify-content: center;
  a {
    text-decoration: none;
  }
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--l-spacing);
}

.feature-card {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  padding: var(--xl-spacing);
  border: 1px solid var(--bolao-c-grey2-t1);
  background: var(--color-background-soft);
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px var(--bolao-c-navy-t1);
  }
  h3 {
    font-size: var(--s-font-size);
    font-weight: 700;
    color: var(--color-heading);
  }
  p {
    font-size: var(--s-font-size);
    color: var(--bolao-c-grey4);
    line-height: 1.6;
  }
}

.feature-icon {
  font-size: var(--xl-font-size);
  color: var(--bolao-c-sky);
}

.section-title {
  font-size: var(--l-font-size);
  font-weight: 700;
  color: var(--color-heading);
}

.steps {
  display: flex;
  flex-direction: column;
  gap: var(--l-spacing);
  list-style: none;
  padding: 0;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: var(--l-spacing);
  strong {
    font-size: var(--s-font-size);
    color: var(--color-heading);
    display: block;
    margin-bottom: var(--xxs-spacing);
  }
  p {
    font-size: var(--s-font-size);
    color: var(--bolao-c-grey4);
    line-height: 1.6;
  }
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bolao-c-navy);
  color: var(--bolao-c-white);
  font-weight: 700;
  font-size: var(--s-font-size);
}

.soon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--m-spacing);
}

.soon-card {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  padding: var(--m-spacing) var(--l-spacing);
  border: 1px dashed var(--bolao-c-grey4);
  color: var(--color-contrast);
  font-size: var(--xs-font-size);
  i {
    font-size: var(--m-font-size);
    color: var(--bolao-c-grey3);
  }
}

.cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--l-spacing);
  padding: var(--xxl-spacing);
  background: linear-gradient(135deg, var(--bolao-c-blue-t1), var(--bolao-c-blue-t2));
  text-align: center;
  p {
    font-size: var(--l-font-size);
    font-weight: 700;
    color: var(--color-heading);
  }
}

.cta-links {
  display: flex;
  gap: var(--l-spacing);
  flex-wrap: wrap;
  justify-content: center;
  a {
    text-decoration: none;
  }
}
</style>
