<template>
  <a
    :href="`https://www.espn.com/nfl/player/_/id/${player.id}`"
    target="_blank"
    rel="noopener noreferrer"
    class="sticker"
    :style="{ '--sticker-color': color }"
  >
    <div class="sticker-strip" />

    <div class="sticker-photo-wrap">
      <img
        v-if="player.headshot"
        :src="player.headshot"
        :alt="player.displayName"
        class="sticker-photo"
        @error="onPhotoError"
      />
      <div
        v-else
        class="sticker-photo sticker-photo--empty"
      >
        <i class="pi pi-user" />
      </div>

      <span class="sticker-overlay sticker-overlay--pos">{{ player.position }}</span>
      <span class="sticker-overlay sticker-overlay--jersey">#{{ player.jersey }}</span>
      <div class="sticker-overlay sticker-overlay--name">{{ player.shortName }}</div>
    </div>

    <div class="sticker-body">
      <div class="sticker-stats">
        <div
          v-if="player.heightCm"
          class="sticker-stat"
        >
          <span class="sticker-stat-value">{{ player.heightCm }}</span>
          <span class="sticker-stat-label">cm</span>
        </div>
        <div
          v-if="player.weightKg"
          class="sticker-stat"
        >
          <span class="sticker-stat-value">{{ player.weightKg }}</span>
          <span class="sticker-stat-label">kg</span>
        </div>
        <div
          v-if="player.age"
          class="sticker-stat"
        >
          <span class="sticker-stat-value">{{ player.age }}</span>
          <span class="sticker-stat-label">anos</span>
        </div>
      </div>

      <div class="sticker-footer">
        <span
          v-if="player.college"
          class="sticker-college"
          >{{ player.college }}</span
        >
        <span
          v-if="player.birthPlace"
          class="sticker-birthplace"
          >📍 {{ player.birthPlace }}</span
        >
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
interface RosterPlayer {
  id: string;
  displayName: string;
  shortName: string;
  headshot: string | null;
  jersey: string;
  position: string;
  positionGroup: string;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  birthPlace: string | null;
  college: string | null;
  experienceYears: number | null;
}

defineProps<{
  player: RosterPlayer;
  color: string;
}>();

function onPhotoError(e: Event) {
  (e.target as HTMLImageElement).style.display = 'none';
}
</script>

<style lang="scss" scoped>
.sticker {
  display: flex;
  flex-direction: column;
  background: var(--color-background-soft);
  border: 1.5px solid var(--bolao-c-grey2-t1);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  position: relative;
  transition:
    transform 0.18s,
    box-shadow 0.18s,
    border-color 0.18s;

  &:hover {
    transform: translateY(-4px) rotate(-0.8deg);
    border-color: var(--sticker-color, var(--bolao-c-sky));
    box-shadow:
      0 8px 24px color-mix(in srgb, var(--sticker-color, #036) 20%, transparent),
      0 1px 4px #0002;
  }
}

.sticker-strip {
  height: 5px;
  background: var(--sticker-color, var(--bolao-c-sky));
  flex-shrink: 0;
}

.sticker-photo-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: linear-gradient(
    170deg,
    color-mix(in srgb, var(--sticker-color, var(--bolao-c-navy)) 30%, var(--bolao-c-navy-l1)) 0%,
    var(--color-background-soft) 100%
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}

.sticker-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.sticker-photo--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--bolao-c-grey3);
  height: 100%;
  width: 100%;
}

.sticker-overlay {
  position: absolute;
  z-index: 2;
  pointer-events: none;
  user-select: none;

  &--pos {
    top: 6px;
    left: 6px;
    font-size: 10px;
    font-weight: 800;
    color: #fff;
    background: var(--sticker-color, var(--bolao-c-sky));
    padding: 2px 6px;
    letter-spacing: 0.06em;
    text-shadow: 0 1px 2px #0004;
  }

  &--jersey {
    top: 6px;
    right: 6px;
    font-size: var(--xs-font-size);
    font-weight: 900;
    color: #fff;
    text-shadow: 0 1px 4px #0006;
    letter-spacing: -0.02em;
  }

  &--name {
    bottom: 0;
    left: 0;
    right: 0;
    padding: 18px var(--xs-spacing) 0;
    background: linear-gradient(to top, #000000, #0004 50%, transparent);
    font-size: var(--s-font-size);
    font-weight: 800;
    color: #fff;
    text-shadow: 0 1px 3px #0008;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
}

.sticker-body {
  padding: var(--xs-spacing) var(--s-spacing) var(--s-spacing);
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-top: 1px solid var(--bolao-c-grey2-t1);
  background: var(--color-background-soft);
}

.sticker-stats {
  display: flex;
  gap: var(--xs-spacing);
  margin-top: 2px;
}

.sticker-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bolao-c-grey5-t1);
  padding: 2px 6px;
  min-width: 36px;
  flex: 1;
}

.sticker-stat-value {
  font-size: 11px;
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1.1;
}

.sticker-stat-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--bolao-c-grey4);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sticker-footer {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 2px;
  padding-top: 4px;
  border-top: 1px solid var(--bolao-c-grey2-t1);
}

.sticker-college {
  font-size: 10px;
  font-weight: 600;
  color: var(--sticker-color, var(--bolao-c-sky));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sticker-birthplace {
  font-size: 9px;
  color: var(--bolao-c-grey3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
