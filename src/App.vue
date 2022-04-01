<script lang="ts">
export default {
  inject: [],
  data: () => ({

  }),
  created() { },
  components: {},
};
</script>

<template>
  <div class="block_main-menu">
    <nav class="main-menu">
      <router-link class="main-menu-item" :class="{ 'active': false }" alt="Go to Home" to="/">H</router-link>

      <router-link
        class="main-menu-item"
        :class="{ 'active': false }"
        alt="Go to Dashboard"
        to="/dashboard"
      >D</router-link>
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
  
  
  .main-menu-item + .main-menu-item{
    margin-top: 20px;
  }
}

.main-menu-item {
  display: flex;
  align-items: center;
  height:50px;
  width:100%;
  text-align:center;

  &:link,
  &:visited,
  &:hover {
    cursor: pointer;
    text-decoration: none;
    text-align:center;
    color: var(--app-text-color);

    &.router-link-active {
      // &.active {
      text-decoration: none;
      color: var(--app-accent);
      border-right: 5px solid var(--app-accent);
    }
  }
}
</style>
