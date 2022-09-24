<template>
  <div id="building">
    <div class="my-login-form">
      <div class="header">FuzzingPort</div>
      <a-form
        :model="formState"
        name="normal_login"
        class="login-form"
        @finish="onFinish"
        @finish-failed="onFinishFailed"
      >
        <a-form-item
          label="账号"
          name="username"
          :rules="[{ required: true, message: '请输入用户名！' }]"
        >
          <a-input v-model:value="formState.username">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码！' }]"
        >
          <a-input-password v-model:value="formState.password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <div class="login-form-wrap">
          <a-form-item name="remember" no-style>
            <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
          </a-form-item>
          <!-- <a href="" style="margintop: 4px">点击注册</a> -->
          <!-- <a class="login-form-forgot" href="">Forgot password</a> -->
        </div>

        <a-form-item>
          <a-button
            :disabled="disabled"
            type="primary"
            html-type="submit"
            class="login-form-button"
            :loading="loading"
            @click="loginSubmit"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, ref } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const router = useRouter();
    const formState = reactive<FormState>({
      username: localStorage.getItem("username") || "",
      password: localStorage.getItem("password") || "",
      remember: true,
    });
    const onFinish = (values: any) => {
      console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };
    const disabled = computed(() => {
      return !(formState.username && formState.password);
    });

    const loading = ref<boolean>(false);
    const setSession = (bool: boolean) => {
      sessionStorage.setItem("token", "token");
      try {
        if (bool) {
          localStorage.setItem("username", formState.username);
          localStorage.setItem("password", formState.password);
        } else {
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }
      } catch (error) {
        console.log(error);
      }
    };
    const loginSubmit = async () => {
      try {
        if (formState.username === "admin" && formState.password === "admin") {
          message.success("登录成功！");
          setSession(formState.remember);
          router.replace("/home/index");
        } else {
          message.error("登录失败，请检查账号密码是否正确！");
        }
      } catch (error) {
        console.log("login error", error);
      }
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
      disabled,
      loading,
      loginSubmit,
    };
  },
});
</script>
<style lang="less" scoped>
#building {
  background: url("../../../public/images/bgimg.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

#app {
  // background-color: pink;
}

.login-form-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.login-form-forgot {
  margin-bottom: 24px;
}
.login-form-button {
  width: 100%;
  margin-top: 20px;
}

.my-login-form {
  margin: 30vh auto 0 auto;
  width: 35vw;
  min-width: 400px;
  padding: 50px 70px 20px 50px;
  /* border: 2px solid rgb(24, 144, 255); */
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.12);
  background-color: rgba(255, 255, 255, 0.3);

  .header {
    font-size: 28px;
    margin-top: -10px;
    margin-bottom: 16px;
    font-family: "Georgia", "Nimbus Roman No9 L", "Songti SC", "Noto Serif CJK SC",
      "Source Han Serif SC", "Source Han Serif CN", "STSong", "AR PL New Sung", "AR PL SungtiL GB",
      "NSimSun", "SimSun", "TW-Sung", "WenQuanYi Bitmap Song", "AR PL UMing CN", "AR PL UMing HK",
      "AR PL UMing TW", "AR PL UMing TW MBE", "PMingLiU", "MingLiU", "serif";
  }
}
</style>
