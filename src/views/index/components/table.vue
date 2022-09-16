<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="tableData"
      :pagination="pageSetting"
      @change="handleTableChange"
    >
      <template #tags="{ text: tags }">
        <span>
          <a-tag :color="tags === '1' ? 'green' : 'volcano'">
            {{ tags === "1" ? "已验证" : "未验证" }}
          </a-tag>
        </span>
      </template>
      <template #action="{ record }">
        <span>
          <a @click="toDetail(record)">详情</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="是否要删除该项内容？"
            ok-text="确认"
            cancel-text="取消"
            @confirm="removeItem(record)"
            @cancel="() => {}"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
defineProps({
  tableData: {
    type: Array<any>,
    default: [],
  },
});
const columns = [
  {
    title: "指纹ID",
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

const emit = defineEmits(["on-detail", "on-remove", "on-page"]);
const toDetail = (val: any) => {
  console.log("table click", val);
  emit("on-detail", val);
};

const removeItem = (val: any) => {
  emit("on-remove", val);
};

// 分页
interface PageSetting {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger: boolean;
  pageSizeOptions: string[];
}
const pageSetting: PageSetting = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50", "100"],
});
const handleTableChange = (pagination: PageSetting) => {
  pageSetting.current = pagination.current;
  pageSetting.pageSize = pagination.pageSize;
  emit("on-page", pagination);
};
</script>

<style lang="less" scoped></style>
