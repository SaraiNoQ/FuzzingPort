<template>
  <div>
    <!-- <Navbar /> -->
    <div id="app">
      <RouterView />
    </div>
    <!-- <Footer /> -->
  </div>
</template>
<script setup lang="ts">
import { logLabeled } from "./utils/logger";
// import Navbar from "./components/layout/Navbar/index.vue";
// import Footer from "./components/layout/Footer/index.vue";

logLabeled("I'm ready!  ⸜(๑'ᵕ'๑)⸝⋆*", "log", "", "color: #66ccff");
</script>

<style lang="less" scoped>
#app {
  margin-top: 0;
  width: 100%;
  min-width: 1170px;
  min-height: 100vh;
}
body {
  margin: 0;
  padding: 0;
  border: 0;
}
</style>
