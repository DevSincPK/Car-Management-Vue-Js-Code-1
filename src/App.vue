<template>
  <!-- Rendering Pages based on path defined in index.js at router folder -->
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

   background-image: radial-gradient(circle at top right, #b2b3f1, #fff 42%, transparent 0), radial-gradient(circle at bottom left, #b2b3f1, #fff 42%, transparent 0);
    content: "";
    /* height: 100%; */
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 0;
}
</style>
