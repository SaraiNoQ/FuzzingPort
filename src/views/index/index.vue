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
            @change="handleSelectChange"
          >
            <a-select-option :value="0">未验证</a-select-option>
            <a-select-option :value="1">已验证</a-select-option>
          </a-select>
        </div>
        <div class="item">
          应用类型：<a-input
            v-model:value="appType"
            style="width: 160px"
            type="textarea"
            :allow-clear="true"
            placeholder="请输入"
          >
          </a-input>
        </div>
        <div class="item">
          <a-button type="primary" @click="serachList"
            >搜索
            <template #icon>
              <SearchOutlined />
            </template>
          </a-button>
        </div>
      </div>

      <div class="table">
        <Table
          :table-data="listData"
          :table-loading="tableLoading"
          :total="totalNum"
          @on-detail="getDetail"
          @on-remove="getDelete"
          @on-page="refreshTable"
        />
      </div>

      <div>
        <a-modal
          v-model:visible="modalVisible"
          title="指纹详情"
          width="1000px"
          wrap-class-name="full-modal"
          :confirm-loading="confirmLoading"
          @ok="handleOk"
        >
          <a-form
            :model="formState"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            class="form-layout"
          >
            <a-form-item label="指纹 ID ">
              <a-input v-model:value="formState.Id" disabled />
            </a-form-item>
            <a-form-item label="操作系统">
              <a-input v-model:value="formState.Os" type="textarea" />
            </a-form-item>
            <a-form-item label="系统版本">
              <a-input v-model:value="formState.Version" />
            </a-form-item>
            <a-form-item label="对应应用">
              <a-input v-model:value="formState.Service" type="textarea" />
            </a-form-item>
          </a-form>

          <a-form :label-col="labelCol" class="middle-item">
            <a-form-item :label="fingerName">
              <a-input v-model:value="formState.Rule" type="textarea" class="middle-first" />
            </a-form-item>
            <a-form-item label="是否验证">
              <a-switch v-model:checked="formState.Verify" />
            </a-form-item>
          </a-form>

          <a-form :label-col="labelCol" class="middle-col">
            <a-form-item label="聚类目标">
              <!-- <a-input v-model:value="formState.Original" type="textarea" /> -->
            </a-form-item>
            <div class="dest">
              <pre>{{ formState.Original }}</pre>
            </div>
          </a-form>

          <a-form :label-col="labelCol" :wrapper-col="wrapperCol" class="res">
            <a-form-item>
              <span>聚类分析响应：</span>
            </a-form-item>
            <a-form-item style="margin-top: -20px">
              <div v-for="(item, index) in formState.Samples" :key="index" class="resp">
                <pre>{{ item }}</pre>
              </div>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, UnwrapRef, onBeforeMount } from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { message } from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import Table from "./components/table.vue";
// @ts-ignore
import axios from "~/utils/axios";

const state = ref<number>();
const handleSelectChange = (val: number) => {
  state.value = val;
};
const appType = ref<string>();

// getlist带参数
const getList = async (
  pagination?: { current: number; pageSize: number },
  valid?: number,
  appType?: string | number
) => {
  let queryStr = `/api/list`;

  if (pagination) {
    queryStr += `?pageNo=${pagination.current}&pageSize=${pagination.pageSize}`;
  }
  if (valid === 0 || valid === 1) {
    queryStr += `&isValid=${valid}`;
  }
  if (appType) {
    queryStr += `&type=${appType}`;
  }
  const res = await axios.get(queryStr);
  return res;
};

// 首页list列表
const listData = ref<Array<TableData>>([]);
interface TableData {
  key: string;
  finger: string;
  address: string;
  tags: string;
}
interface Datum {
  /**
   * 应用名称
   */
  app?: string;
  /**
   * 指纹
   */
  finger?: string;
  /**
   * 指纹id，用于查询详情
   */
  id: string;
  status?: string;
}

const totalNum = ref<number>(0);
onBeforeMount(async () => {
  const res = await axios.get("/api/list?pageNo=1&pageSize=10");
  if (res.status === 200) {
    const resData: [] = res.data;
    totalNum.value = res.total;
    const arr: Array<TableData> = [];
    resData.forEach((e: Datum, index: number) => {
      arr.push({
        key: e.id,
        finger: e.finger,
        address: e.app,
        tags: e.status,
      } as TableData);
    });
    listData.value = arr;
  }
});

// 过滤搜索
const serachList = async () => {
  const res = await getList({ current: 1, pageSize: 10 }, state.value, appType.value);
  const resData = res.data;
  if (!resData || resData.lenght === 0) {
    message.warning("没有找到相关记录");
    return;
  }
  const arr: Array<TableData> = [];
  totalNum.value = res.total;
  resData.forEach((e: Datum, index: number) => {
    arr.push({
      key: e.id,
      finger: e.finger,
      address: e.app,
      tags: e.status,
    } as TableData);
  });
  listData.value = arr;
};

// 刷新表格
const refreshTable = async (val: any) => {
  const res = await getList(val, state.value, appType.value);
  const resData = res.data;
  const arr: Array<TableData> = [];
  totalNum.value = res.total;
  resData.forEach((e: Datum, index: number) => {
    arr.push({
      key: e.id,
      finger: e.finger,
      address: e.app,
      tags: e.status,
    } as TableData);
  });
  listData.value = arr;
};

// visible
const modalVisible = ref<boolean>(false);
const fingerName = ref<string>("指纹");

const showModal = () => {
  modalVisible.value = true;
};
const getDetail = async (val: any) => {
  if (!val.key) {
    message.error("未查到指纹ID！");
    return;
  }
  try {
    const res = await axios.get(`/api/detail?id=${val.key}`);
    if (res.status === 200) {
      const resData: FormState = res.data;
      formState.Id = resData.Id;
      formState.Original = resData.Original;
      formState.Os = resData.Os;
      formState.Rule = resData.Rule;
      formState.Samples = resData.Samples;
      formState.Samples.map((e: string) => {
        handleSamp(e);
      });
      formState.Service = resData.Service;
      formState.Verify = (resData.Verify as unknown) === "1" ? true : false;
      formState.Version = resData.Version;

      // 修改标签名
      if (resData.type === 1) {
        fingerName.value = "指纹(时间维度)";
      } else if (resData.type === 0) {
        fingerName.value = "指纹";
      }
    }
  } catch (error) {}

  showModal();
};
const handleSamp = (str: string) => {
  return str.replaceAll("\n", "<br/>");
};

// delete item
const tableLoading = ref<boolean>(false);
const getDelete = async (val: any) => {
  try {
    tableLoading.value = true;
    const data = {
      id: val.key,
    };
    await axios.post("/api/delete", data);
    const arr: Array<TableData> = [];
    listData.value.forEach((e: TableData) => {
      if (e.key !== val.key) {
        arr.push(e);
      }
    });
    listData.value = arr;
    message.success("删除成功！");
  } catch (error) {
    console.error("删除失败！");
  } finally {
    tableLoading.value = false;
  }
};

const confirmLoading = ref<boolean>(false);
const handleOk = async (e: MouseEvent) => {
  confirmLoading.value = true;
  try {
    // const fd = {
    //   id: formState.Id,
    //   os: formState.Os,
    //   rule: formState.Rule,
    //   service: formState.Service,
    //   isValid: formState.Verify,
    //   version: formState.Version,
    // };
    // const formData = new FormData();
    const formData = new URLSearchParams();
    formData.append("id", formState.Id);
    formData.append("os", formState.Os);
    formData.append("rule", formState.Rule);
    formData.append("service", formState.Service);
    formData.append("isValid", formState.Verify ? "1" : "0");
    formData.append("version", formState.Version);
    await axios.post("/api/detail", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // const res = await axios.post("/api/detail", fd, {
    //   "Content-Type": "application/x-www-form-urlencoded",
    // });
    message.success("修改成功！", 1);

    modalVisible.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    confirmLoading.value = false;
  }
};

// form
interface FormState {
  Id: string;
  Version: string;
  // appDesc: string;
  Verify: boolean;
  Os: string;
  Service: string;
  Rule: string;
  Original: string;
  Samples: string[];
  type?: string | number;
}
const labelCol = { style: { width: "80px" } };
const wrapperCol = { style: { width: "350px" } };
const formState: UnwrapRef<FormState> = reactive({
  Id: "",
  Version: "",
  Verify: true,
  Os: "",
  Service: "",
  Rule: "",
  Original: "",
  Samples: [],
});

// table
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  width: 6px; /*竖向*/
  height: 5px; /*横向*/
}

/*滚动条的滑块*/
::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 2px;
  cursor: pointer;
}
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
  margin-bottom: 20px;
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

  .resp {
    overflow-y: auto;
    overflow-x: visible;
    height: 110px;
    margin: 20px 150px 25px 0;
    padding: 5px 10px 5px 20px;
    font-size: 16px;
    border: 1px solid grey;
  }
}

.middle-item {
  display: flex;
  margin-top: 30px;

  .middle-first {
    width: 40vw;
    min-width: 350px;
  }
}

.middle-col {
  margin: 30px 150px 40px 10px;

  .dest {
    overflow-y: auto;
    overflow-x: visible;
    height: 90px;
    margin-top: -10px;
    padding: 5px 10px 5px 20px;
    font-size: 16px;
    border: 1px solid grey;
  }
}
</style>
