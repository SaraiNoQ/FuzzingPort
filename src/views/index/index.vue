<template>
  <div class="content">
    <a-config-provider :locale="zhCN">
      <div class="header">
        <div class="item">
          是否验证：<a-select
            ref="select"
            v-model:value="state"
            style="width: 160px"
            :allow-clear="true"
            placeholder="状态"
          >
            <a-select-option :value="0">未验证</a-select-option>
            <a-select-option :value="1">已验证</a-select-option>
          </a-select>
        </div>
        <div class="item">
          应用类型：<a-select
            ref="select"
            v-model:value="appType"
            style="width: 160px"
            :allow-clear="true"
            placeholder="请选择"
          >
            <a-select-option :value="0">类型1</a-select-option>
            <a-select-option :value="1">类型2</a-select-option>
          </a-select>
        </div>
        <div class="item">
          <div class="in-item">
            <span class="p">模糊查询：</span
            ><a-input-search
              v-model:value="searchValue"
              class="s"
              placeholder="请输入模糊查询"
              enter-button="搜索"
              :loading="searchLoading"
              @search="onSearch"
            />
          </div>
        </div>
      </div>

      <div class="new">
        <a-button type="primary"
          >新建URL
          <template #icon>
            <PlusOutlined />
          </template>
        </a-button>
      </div>

      <div class="table"><Table @on-detail="getDetail" /></div>

      <div>
        <a-modal
          v-model:visible="modalVisible"
          title="指纹详情"
          width="1000px"
          wrap-class-name="full-modal"
          @ok="handleOk"
        >
          <a-form
            :model="formState"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            class="form-layout"
          >
            <a-form-item label="指纹 ID ">
              <a-input v-model:value="formState.fingerId" disabled />
            </a-form-item>
            <a-form-item label="应用描述">
              <a-input v-model:value="formState.appDesc" type="textarea" />
            </a-form-item>
            <a-form-item label="是否验证">
              <a-switch v-model:checked="formState.validate" />
            </a-form-item>
            <a-form-item label="应用版本">
              <a-select v-model:value="formState.version" placeholder="选择版本">
                <a-select-option value="shanghai">Zone one</a-select-option>
                <a-select-option value="beijing">Zone two</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
          <a-form :label-col="labelCol" :wrapper-col="wrapperCol" class="res">
            <a-form-item>
              <span>聚类分析响应：</span>
            </a-form-item>
            <a-form-item>
              <a-table :columns="columns" :data-source="data" :pagination="false"> </a-table>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, UnwrapRef } from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { PlusOutlined } from "@ant-design/icons-vue";
import Table from "./components/table.vue";

const state = ref<number>();
const appType = ref<number>();

const searchValue = ref<string>("");
const searchLoading = ref<boolean>(false);
const onSearch = () => {
  searchLoading.value = true;
};

// visible
const modalVisible = ref<boolean>(false);
const showModal = () => {
  modalVisible.value = true;
};
const getDetail = (val: any) => {
  console.log("father", val);
  showModal();
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  modalVisible.value = false;
};

// form
interface FormState {
  fingerId: string;
  version: string | undefined;
  appDesc: string;
  validate: boolean;
}
const labelCol = { style: { width: "80px" } };
const wrapperCol = { style: { width: "350px" } };
const formState: UnwrapRef<FormState> = reactive({
  fingerId: "",
  version: undefined,
  appDesc: "",
  validate: true,
});

// table
const columns = [
  {
    title: "IP",
    dataIndex: "ip",
  },
  {
    title: "Port",
    dataIndex: "port",
  },
  {
    title: "端口响应",
    dataIndex: "response",
  },
];

const data = [
  {
    ip: "127.0.0.1",
    port: "80",
    response: "http",
  },
  {
    ip: "127.0.0.1",
    port: "80",
    response: "http",
  },
  {
    ip: "127.0.0.1",
    port: "80",
    response: "http",
  },
  {
    ip: "127.0.0.1",
    port: "80",
    response: "http",
  },
];
</script>

<style lang="less" scoped>
.content {
  margin: 20px 0px 0px 0px;
  background-color: #fff;
  padding: 12px 24px 24px 24px;
  min-height: 80vh;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
}

.header {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.in-item {
  display: flex;
  align-items: center;

  .p {
    min-width: 70px;
  }

  .s {
    max-width: 280px;
    width: 45vw;
  }
}

.new {
  margin: 16px 0;
}

.form-layout {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.res {
  margin: 10px 0px 10px 10px;
}
</style>
