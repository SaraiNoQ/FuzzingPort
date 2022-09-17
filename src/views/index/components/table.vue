<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="tableData"
      :pagination="pageSetting"
      :loading="tableLoading"
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
            style="width: 100px"
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
import { watch, ref } from "vue";

const props = defineProps({
  tableData: {
    type: Array<any>,
    default: [],
  },
  tableLoading: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    default: 0,
  },
});
const columns = [
  {
    title: "指纹ID",
    dataIndex: "key",
    width: 80,
    align: "left",
  },
  {
    title: "状态",
    dataIndex: "tags",
    slots: { customRender: "tags" },
    width: 100,
    align: "center",
  },
  {
    title: "指纹",
    dataIndex: "finger",
  },
  {
    title: "应用名称",
    dataIndex: "address",
    width: 160,
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
    width: 120,
  },
];

const emit = defineEmits(["on-detail", "on-remove", "on-page"]);
const toDetail = (val: any) => {
  console.log("table click", val, pageSetting);
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
const pageSetting = ref<PageSetting>({
  current: 1,
  pageSize: 10,
  total: props.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50", "100"],
});
watch(
  () => props.total,
  () => {
    pageSetting.value.total = props.total;
  }
);
const handleTableChange = (pagination: PageSetting) => {
  pageSetting.value.current = pagination.current;
  pageSetting.value.pageSize = pagination.pageSize;
  emit("on-page", pagination);
};
</script>

<style lang="less" scoped>
/deep/ .ant-table-cell {
  max-width: 760px;
}
</style>
