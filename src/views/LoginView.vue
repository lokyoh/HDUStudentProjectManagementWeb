<script setup lang="ts">
import { reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { api } from "../assets/api.ts";

if (api.loginState == true){
  window.location.replace("./app");
}else{
  let o_token = api.getCookie('token');
  if (o_token){
    fetch(`${api.apiUrl}/tokenCheck?token=${o_token}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.code == 0){
        window.location.replace("./app");
      }
    })
    .catch(error => {
      alert("服务器请求失败");
    });
  }
}

interface FormState {
  username: string;
  password: string;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
});

const onFinish = (values: any) => {
  fetch(`${api.apiUrl}/login?username=${values.username}&password=${values.password}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.code == 0){
      api.setCookie('username', data.data.username);
      api.setCookie('role', data.data.role);
      api.setCookie('token', data.data.token);
      window.location.replace("./app");
    }else{
      alert(data.message);
    }
  })
  .catch(error => {
    alert("服务器请求失败");
  });
};

const disabled = computed(() => {
  return !(formState.username && formState.password);
});
</script>

<template>
  <a-layout style="height: 100vh">
    <a-layout-header style="width: 100%;font-size: xx-large;background-color: #fff;">
      杭电学生项目管理系统
    </a-layout-header>
    <a-layou-content style="display: flex;justify-content: center;align-items: center;height: 100%;">
      <a-card style="width: 320px; text-align: center">
        <a-form
          :model="formState"
          name="normal_login"
          class="login-form"
          @finish="onFinish"
        >
          <a-form-item
            label="用户名"
            name="username"
            :rules="[{ required: true, message: '请输入用户名!' }]"
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
            :rules="[{ required: true, message: '请输入密码!' }]"
          >
            <a-input-password v-model:value="formState.password">
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
              登录
            </a-button>
            Or
            <a href="./register">注册</a>
          </a-form-item>
        </a-form>
      </a-card>
    </a-layou-content>
  </a-layout>
</template>
