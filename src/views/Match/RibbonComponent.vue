<template>
  <div
    v-if="activeProfile"
    class="ribbon"
    :class="{
      'bullseye-bg': displayedRibbon === 'BULLSEYE',
      'half-bg': displayedRibbon === 'HALF',
      'miss-bg': displayedRibbon === 'MISS',
      'null-bg': displayedRibbon === null,
      'ribbon--plant': isPlanting,
      'ribbon--retreat': isRetreating
    }"
  >
    <i
      v-show="displayedRibbon === 'BULLSEYE'"
      v-tooltip.top="'Na mosca'"
      class="pi pi-bullseye"
    ></i>
    <i
      v-show="displayedRibbon === 'HALF'"
      v-tooltip.top="'Vencedor correto'"
      class="pi pi-check"
    ></i>
    <i
      v-show="displayedRibbon === 'MISS'"
      v-tooltip.top="'Erroooou!'"
      class="pi pi-times"
    ></i>
    <i
      v-show="displayedRibbon === null"
      v-tooltip.top="'Sem apostas'"
      class="pi pi-times"
    ></i>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Ribbon } from '@/constants/bets';
import { useActiveProfileStore } from '@/stores/activeProfile';

const props = defineProps<{
  ribbon?: Ribbon;
}>();

// ------ Initialization ------
const activeProfileStore = useActiveProfileStore();
const isPlanting = ref(false);
const isRetreating = ref(false);
const displayedRibbon = ref(props.ribbon);

// ------ Computed Properties ------
const activeProfile = computed(() => activeProfileStore.activeProfile);

// ------ Watches ------
watch(
  () => props.ribbon,
  (newVal, oldVal) => {
    if (newVal === oldVal) return;

    // Retreat with the OLD color still showing
    isRetreating.value = true;
    isPlanting.value = false;

    setTimeout(() => {
      // Swap to the new color only after retreating
      displayedRibbon.value = newVal;
      isRetreating.value = false;
      isPlanting.value = true;

      setTimeout(() => {
        isPlanting.value = false;
      }, 500);
    }, 400);
  }
);
</script>
<style lang="scss" scoped>
.ribbon {
  --f: 0.2em;
  /* control the folded part */
  --r: 0.2em;
  /* control the cutout */

  font-size: var(--m-font-size);
  font-weight: bold;
  color: #fff;
  position: absolute;
  right: 2px;
  top: calc(-1 * var(--f));
  padding: 0.2em;
  border: solid #0000;
  border-width: 0 0 var(--r) calc(2 * var(--f));
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: #bf4d28;
  border-radius: var(--f) var(--f) 0 0;
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - var(--r)),
    calc(50% + var(--f)) 100%,
    calc(2 * var(--f)) calc(100% - var(--r)),
    calc(2 * var(--f)) var(--f),
    0 var(--f)
  );
  z-index: 1;
  box-shadow: 0 0 15px 1px #0006;
  transform-origin: top center;

  &--retreat {
    animation: flag-retreat 0.4s ease-in forwards;
  }

  &--plant {
    animation: flag-plant 0.5s ease-out forwards;
  }

  @media (max-width: 1023px) {
    height: 30px;
    right: 0px;
    padding: 0 0.2em;

    i {
      font-size: var(--xs-font-size);
    }
  }
}

.bullseye-bg {
  --c: var(--bolao-c-gold);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.half-bg {
  --c: var(--bolao-c-blue);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.miss-bg {
  --c: var(--bolao-c-red);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.null-bg {
  --c: var(--bolao-c-grey4);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

@keyframes flag-retreat {
  0% {
    transform: translateY(0) scaleY(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-110%) scaleY(0.3);
    opacity: 0;
  }
}

@keyframes flag-plant {
  0% {
    transform: translateY(-110%) scaleY(0.3);
    opacity: 0;
  }
  60% {
    transform: translateY(8%) scaleY(1.05);
    opacity: 1;
  }
  80% {
    transform: translateY(-3%) scaleY(0.97);
  }
  100% {
    transform: translateY(0) scaleY(1);
    opacity: 1;
  }
}
</style>
