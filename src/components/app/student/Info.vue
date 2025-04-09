<script setup lang="ts">
import { computed, ref } from "vue";
import { message } from "ant-design-vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";

const studentInfo = ref({
    name: null,
    studentId: null,
    classNumber: null,
    email: null,
    phone: null,
});

const loading = ref(false);

function fetchInfo() {
    return apiClient.get(`${api.apiUrl}/student/info`, {});
}

function ChangeInfo(params: any) {
    return apiClient.post(`${api.apiUrl}/student/info/change?p=${formData.value.oldPassword}`, params, {headers: {"Content-Type": "application/json",},});
}

async function handleGet(){
    if (loading.value) return;
    loading.value = true;
    try {
        const response = await fetchInfo();
        if (response.data.code==0){
            studentInfo.value = response.data.data;
            resetForm();
        }else{
            alert(response.data.message);
        }
    } catch (error) {
        console.error("查询失败:", error);
    }
    loading.value = false;
};

async function submitForm(){
    if (formData.value.password && formData.value.password !== formData.value.confirmPassword) {
        message.error("新密码和确认密码不匹配！");
        return;
    }
    try {
        const response = await ChangeInfo(formData.value);
        if (response.data.code != 0){
            alert(response.data.message);
        }else{
            toggleEdit();
        }
    } catch (error) {
        console.error("查询失败:", error);
    }
};

handleGet();

const isEditing = ref(false);

const formData = ref({
  class: studentInfo.value.classNumber,
  email: studentInfo.value.email,
  phone: studentInfo.value.phone,
  oldPassword: "",
  password: "",
  confirmPassword: "",
});

// 切换编辑模式
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    handleGet();
  }
};

// 取消编辑，重置表单
const resetForm = () => {
  formData.value.class = studentInfo.value.classNumber;
  formData.value.email = studentInfo.value.email;
  formData.value.phone = studentInfo.value.phone;
  formData.value.oldPassword = "";
  formData.value.password = "";
  formData.value.confirmPassword = "";
};

const passwordsMatch = computed(() => {
  return formData.value.password === formData.value.confirmPassword;
});
</script>

<template>
    <a-card title="我的信息" style="max-width: 600px; margin: auto;">
    <!-- 展示模式 -->
    <template v-if="!isEditing">
      <a-descriptions bordered>
        <a-descriptions-item label="姓名">{{ studentInfo.name }}</a-descriptions-item>
        <a-descriptions-item label="学号">{{ studentInfo.studentId }}</a-descriptions-item>
        <a-descriptions-item label="班级">{{ studentInfo.classNumber }}</a-descriptions-item>
        <a-descriptions-item label="邮箱">{{ studentInfo.email }}</a-descriptions-item>
        <a-descriptions-item label="电话">{{ studentInfo.phone }}</a-descriptions-item>
      </a-descriptions>
      <a-button type="primary" style="margin-top: 10px" @click="toggleEdit">修改信息</a-button>
      <a-button type="primary" style="margin-top: 10px" @click="handleGet">信息</a-button>
    </template>

    <!-- 编辑模式 -->
    <template v-else>
      <a-form layout="vertical">
        <a-form-item label="班级">
          <a-input v-model:value="formData.class" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="formData.email" />
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-model:value="formData.phone" />
        </a-form-item>
        <a-divider>密码修改（可选）</a-divider>
        <a-form-item label="原密码">
          <a-input-password v-model:value="formData.oldPassword" />
        </a-form-item>
        <a-form-item label="新密码">
          <a-input-password v-model:value="formData.password" />
        </a-form-item>
        <a-form-item 
          label="确认新密码"
          :validate-status="!passwordsMatch ? 'error' : ''"
          :help="!passwordsMatch ? '两次输入的密码不匹配' : ''"
        >
          <a-input-password v-model:value="formData.confirmPassword" />
        </a-form-item>
        <a-space>
            <a-button 
            type="primary" 
            :disabled="!passwordsMatch" 
            @click="submitForm"
          >提交</a-button>
          <a-button @click="toggleEdit">取消</a-button>
        </a-space>
      </a-form>
    </template>
  </a-card>
</template>