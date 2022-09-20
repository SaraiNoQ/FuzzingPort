<template>
  <div class="tb">
    <a-config-provider :locale="zhCN">
      <a-modal
        v-model:visible="visible"
        title="新增指纹"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
      >
        <a-form
          :model="formState"
          class="form-layout"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :rules="rules"
        >
          <a-form-item label="探 针" name="probestring">
            <a-input v-model:value="formState.probestring" />
          </a-form-item>
          <a-form-item label="端 口">
            <a-input v-model:value="formState.ports" type="textarea" />
          </a-form-item>
          <a-form-item label="SSL 端 口">
            <a-input v-model:value="formState.sslports" />
          </a-form-item>
          <a-form-item label="优 先 级" name="rarity">
            <a-input v-model:value="formState.rarity" type="number" placeholder="越小越优先" />
          </a-form-item>
          <a-form-item label="等待时间">
            <a-input v-model:value="formState.totalwaits" type="number" placeholder="单位:ms" />
          </a-form-item>
          <a-form-item label="类 型" name="type">
            <a-select
              v-model:value="formState.type"
              style="width: 200px"
              :allow-clear="true"
              placeholder="0表示udp、1表示tcp"
              @change="handleSelectChange"
            >
              <a-select-option :value="0">UDP</a-select-option>
              <a-select-option :value="1">TCP</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
      <div style="margin-bottom: 15px">
        <a-button type="primary" @click="addProbe">新 增 探 针</a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="pageSetting"
        :loading="tableLoading"
        @change="handleTableChange"
      >
        <template #action="{ record }">
          <span>
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
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, reactive } from "vue";
import { message } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
// @ts-ignore
import axios from "~/utils/axios";

interface Datum {
  enable?: number;
  id?: number;
  plaintext?: string;
  ports?: string;
  probestring?: string;
  rarity?: number;
  sslports?: string;
  totalwaitms?: number;
  type?: number;
}
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    align: "left",
  },
  {
    title: "探针base64格式",
    dataIndex: "probestring",
    align: "center",
  },
  {
    title: "探针明文格式",
    dataIndex: "plaintext",
  },
  {
    title: "允许的端口",
    dataIndex: "ports",
  },
  {
    title: "允许的ssl端口",
    dataIndex: "sslports",
  },
  {
    title: "优先级(越小越优先)",
    dataIndex: "rarity",
    align: "left",
  },
  {
    title: "等待时间(ms)",
    dataIndex: "totalwaitms",
    align: "left",
  },
  {
    title: "类型",
    dataIndex: "type",
    align: "left",
  },
  {
    title: "是否启用",
    dataIndex: "enable",
    align: "left",
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
    width: 120,
  },
];

// tableData
const tableData = ref<Datum>();
const tableLoading = ref<boolean>(false);
onBeforeMount(async () => {
  tableLoading.value = true;
  try {
    const res = await axios.get("/api/probe/list?pageNo=1&pageSize=10");
    if (res.status === 200) {
      tableData.value = res.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    tableLoading.value = false;
  }
});

// modal
const labelCol = { style: { width: "80px" } };
const wrapperCol = { style: { width: "350px" } };
interface FormData {
  probestring: string;
  type: number | undefined;
  rarity: number | undefined;
  ports: string;
  sslports: string;
  totalwaits: number | undefined;
}
const formState: FormData = reactive({
  probestring: "",
  type: undefined,
  rarity: undefined,
  ports: "",
  sslports: "",
  totalwaits: undefined,
});

const handleSelectChange = () => {
  console.log("changeSelect", formState.type);
};

const visible = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const addProbe = () => {
  visible.value = true;
};
const handleOk = async () => {
  confirmLoading.value = true;
  try {
    const formData = new URLSearchParams();
    formData.append("probestring", formState.probestring);
    formData.append("type", formState.type + "");
    formData.append("rarity", formState.rarity + "");
    formData.append("ports", formState.ports);
    formData.append("sslports", formState.sslports);

    const res = await axios.post("/api/probe/add", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (res.status === 200) {
      message.success("新增探针成功！", 1200);
      visible.value = false;
    } else {
      message.error("新增探针失败！", 1200);
    }
  } catch (error) {
    console.log(error);
  } finally {
    confirmLoading.value = false;
  }
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
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50", "100"],
});

const refreshTable = async (no: number, size: number) => {
  const res = await axios.get(`/api/probe/list?pageNo=${no}&pageSize=${size}`);
  return {
    status: res.status,
    data: res.data,
  };
};
const handleTableChange = async (pagination: PageSetting) => {
  pageSetting.value.current = pagination.current;
  pageSetting.value.pageSize = pagination.pageSize;
  const data = await refreshTable(pageSetting.value.current, pageSetting.value.pageSize);
  if (data.status === 200) {
    tableData.value = data.data;
  }
};

const removeItem = async (record: any) => {
  const res = await axios.get("/api/probe/delete?id=" + record.id);
  if (res.status === 200) {
    message.success("删除成功！", 1200);
  } else {
    message.error("删除失败！", 1200);
  }
};

const rules = {
  probestring: [{ required: true, message: "探针名字必填", trigger: "change" }],
  type: [{ required: true, message: "类型必填", trigger: "blur" }],
  rarity: [{ required: true, message: "优先级必填", trigger: "blur" }],
};
</script>

<style lang="less" scoped>
.tb {
  margin-top: 20px;
  background-color: #fff;
  padding: 12px 24px 24px 24px;
  min-height: 79vh;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
}
/deep/ .ant-table-cell {
  max-width: 750px;
}
</style>
