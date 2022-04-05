<script lang="ts">
export default {
  inject: [],
  data: () => ({ }),
};
</script>

<template>
  <div class="block_main-menu">
    <nav class="main-menu">
      <router-link class="main-menu-item" :class="{ 'active': false }" alt="Go to Home" to="/">H</router-link>

      <!-- <router-link
        class="main-menu-item"
        :class="{ 'active': false }"
        alt="Go to Dashboard"
        to="/dashboard"
      >D</router-link> -->
    </nav>
  </div>

  <router-view />
</template>

<style  lang="scss">
@import "./App.scss";

.main-menu {
  display: flex;
  flex-direction: column;
  font-family: var(--font-copy);
}

.main-menu-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height:50px;
  width:100%;

  &:link,
  &:visited,
  &:hover {
    cursor: pointer;
    text-decoration: none;
    text-align:center;
    color: var(--app-text-color-contrast);

    &.router-link-active {
      text-decoration: none;
      color: var(--app-accent);
    }
  }
}
</style>
