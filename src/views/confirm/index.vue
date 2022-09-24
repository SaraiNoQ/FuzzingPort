<template>
  <div class="container">
    <a-config-provider :locale="zhCN">
      <div class="header">
        <a-input
          v-model:value="id"
          class="finger"
          placeholder="指纹ID"
          :allow-clear="true"
          @keydown.enter="search"
        />
        <a-button type="primary" @click="search"
          >搜索
          <template #icon>
            <SearchOutlined />
          </template>
        </a-button>
      </div>
      <div v-if="visible" class="content">
        <div v-if="fingerList?.length > 0" class="data">
          <div class="finger-header">
            <span style="width: 40px">指纹</span>
            <a-textarea v-model:value="Rule" :autosize="{ minRows: 2, maxRows: 6 }"></a-textarea>
          </div>
          <div class="finger-content">
            <div v-for="(item, index) in fingerList" :key="index" class="item">
              <pre class="pre">{{ item.Banner }}</pre>
              <div class="verify">
                <a-badge
                  :color="item.Result ? 'green' : 'red'"
                  :text="item.Result ? '验证成功' : '验证失败'"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="null">
          <a-empty />
        </div>
      </div>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
// @ts-ignore
import axios from "~/utils/axios";

const visible = ref<boolean>(false);

interface Data {
  CheckResult: CheckResult[];
  Rule: string;
}

interface CheckResult {
  Banner?: string;
  Result?: boolean;
}

const id = ref<string>("");
const Rule = ref<string>("");
const fingerList = ref<Array<CheckResult>>([]);
const search = async () => {
  try {
    const formData = new URLSearchParams();
    formData.append("id", id.value);
    const res = await axios.post("/api/check_rule", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (res.status === 200) {
      const resData: Data = res.data;
      Rule.value = resData.Rule;
      fingerList.value = resData.CheckResult;
    }
  } catch (error) {
    console.log(error);
  } finally {
    visible.value = true;
  }
};
</script>

<style lang="less" scoped>
.container {
  margin-top: 20px;
  background-color: #fff;
  padding: 12px 24px 24px 24px;
  min-height: fit-content;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
}

.header {
  margin: 10px auto;
  padding-right: 60px;
  width: 38%;
  display: flex;
  gap: 40px;
}

.content {
  margin-top: 30px;
  border-top: 1px solid rgb(218, 213, 213);
  margin: 30px auto;
  width: 85%;

  .null {
    margin-top: 20px;
  }

  .data {
    margin: 20px auto;
  }

  .finger-header {
    margin: 0px 0px 25px 20px;
    font-size: 18px;
    width: 80%;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .finger-content {
    flex-direction: column;

    .item {
      width: 100%;
      margin: 10px 0px 10px 20px;
      display: flex;
      align-items: center;
      gap: 20px;

      .pre {
        font-size: 16px;
        width: 80%;
        height: 120px;
        border: 1px solid rgb(150, 147, 147, 0.5);
        padding: 5px 10px 5px 20px;
        overflow: auto;
      }

      .verify {
        font-family: Georgia, "Times New Roman", Times, serif;
      }
    }
  }
}
</style>
