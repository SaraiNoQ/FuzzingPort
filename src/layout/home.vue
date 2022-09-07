<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible :trigger="null">
      <div class="logo"><span class="font" :class="{ coll: collapsed }">FuzzingPort</span></div>
      <slot name="aside" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" class="header">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />

        <div class="avatar">
          <slot name="avatar" class="avatar" />
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <slot name="breadcrumb" />
        <keep-alive>
          <router-view />
        </keep-alive>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        <slot name="footer" />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";

const collapsed = ref<boolean>(false);
</script>
<style lang="less" scoped>
.logo {
  height: 32px;
  margin: 16px 16px 16px 0px;
  // background: rgba(255, 255, 255, 0.3);
  text-align: center;

  .font {
    color: white;
    font-size: 22px;
    letter-spacing: 0.5px;
  }

  .coll {
    font-size: 15px;
    line-height: 32px;
    letter-spacing: 0px;
  }
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.header {
  position: relative;

  .avatar {
    position: absolute;
    right: 24px;
    top: 0px;
  }
}
</style>
