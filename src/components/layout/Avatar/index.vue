<template>
  <div class="avatar">
    <a-avatar>
      <template #icon><UserOutlined /></template>
    </a-avatar>
    <div>欢迎，{{ userName }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { UserOutlined } from "@ant-design/icons-vue";

const userName = ref<string>("用户A");
</script>
<style lang="less" scoped>
.avatar {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
