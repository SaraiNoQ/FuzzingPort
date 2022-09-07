<template>
  <div>
    <a-table :columns="columns" :data-source="data">
      <template #tags="{ text: tags }">
        <span>
          <a-tag v-for="tag in tags" :key="tag" :color="tag === '未验证' ? 'volcano' : 'green'">
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template #action="{ record }">
        <span>
          <a @click="toDetail(record)">详情</a>
          <a-divider type="vertical" />
          <a>删除</a>
        </span>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
// import { onBeforeMount, reactive, ref } from "vue";

const columns = [
  {
    title: "序号",
    dataIndex: "key",
  },
  {
    title: "状态",
    dataIndex: "tags",
    slots: { customRender: "tags" },
  },
  {
    title: "指纹",
    dataIndex: "finger",
  },
  {
    title: "应用名称",
    dataIndex: "address",
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
  },
];

const data = [
  {
    key: "1",
    finger: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["已验证"],
  },
  {
    key: "2",
    finger: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["未验证"],
  },
  {
    key: "3",
    finger: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["已验证"],
  },
];

const emit = defineEmits(["on-detail"]);
const toDetail = (val: any) => {
  console.log("table click", val);
  emit("on-detail", val);
};
</script>

<style lang="less" scoped></style>
