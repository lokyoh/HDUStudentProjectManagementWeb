<script setup lang="ts">
import { reactive, computed } from 'vue';
import { api } from "../assets/api.ts";

interface FormState {
    password: string,
    studentId: string,
    studentName: string,
    classNumber: string,
    phone: string,
    email: string,
}

const formState = reactive<FormState>({
  password: '',
  studentId: '',
  studentName: '',
  classNumber: '',
  phone: '',
  email: '',
});

const onFinish = (values: any) => {
    fetch(`${api.apiUrl}/register`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formState),
    })
    .then(response => response.json())
    .then(data => {
        if (data.code == 0){
            window.location.replace("./login");
        }else{
            alert(data.message);
        }
    })
    .catch(error => {
        alert("服务器请求失败");
    });
};

const disabled = computed(() => {
  return !(formState.studentId && formState.password && formState.studentName && formState.email && formState.classNumber);
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
                label="姓名"
                name="studentName"
                :rules="[{ required: true, message: '请输入姓名!' }]"
            >
                <a-input v-model:value="formState.studentName"></a-input>
            </a-form-item>

            <a-form-item
                label="学号"
                name="studentId"
                :rules="[{ required: true, message: '请输入学号!' }]"
            >
                <a-input v-model:value="formState.studentId"></a-input>
            </a-form-item>

            <a-form-item
                label="密码"
                name="password"
                :rules="[{ required: true, message: '请输入密码!' }]"
            >
                <a-input-password v-model:value="formState.password"></a-input-password>
            </a-form-item>

            <a-form-item
                label="班级"
                name="classNumber"
                :rules="[{ required: true, message: '请输入班级!' }]"
            >
                <a-input v-model:value="formState.classNumber"></a-input>
            </a-form-item>

            <a-form-item
                label="邮箱"
                name="email"
                :rules="[{ required: true, message: '请输入邮箱!' }]"
            >
                <a-input v-model:value="formState.email"></a-input>
            </a-form-item>

            <a-form-item
                label="电话"
                name="phone"
            >
                <a-input v-model:value="formState.phone"></a-input>
            </a-form-item>

            <a-form-item>
                <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
                    注册
                </a-button>
            </a-form-item>
        </a-form>
      </a-card>
    </a-layou-content>
  </a-layout>
</template>
