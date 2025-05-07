<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";
import type { Rule } from "ant-design-vue/es/form";

const searchParams = ref({
  creatorId: null,
  classId: null,
  status: null,
  reviewStatus: null,
});

const users = ref([]);
const loading = ref(false);

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

function fetchUsers(params: any) {
  return apiClient.get(`${api.apiUrl}/admin/user/get`, { params });
}

async function handleSearch() {
  if (loading.value) return;
  loading.value = true;
  try {
    let params = Object.assign({ pageNum: pagination.value.current, PageSize: pagination.value.pageSize }, searchParams.value);
    const response = await fetchUsers(params);
    users.value = response.data.data.items;
    pagination.value.total = response.data.data.count;
  } catch (error) {
    console.error("查询失败:", error);
  }
  loading.value = false;
};

const handleTableChange = (pag: { current: number; pageSize: number; total: number; }) => {
  pagination.value = pag;
  handleSearch();
}

onMounted(handleSearch);

function newProject(params: any) {
  return apiClient.post(`${api.apiUrl}/project/student/create`);
}

async function handleNewProject() {
  console.log('click')
}

const NPopen = ref<boolean>(false);

const PForm = reactive({
  name: '',
  description: '',
  teacherId: null,
  classId: null,
  startDate: null,
});

const PFRules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入项目名称' }],
  description: [{ required: true, message: '请输入项目描述' }],
  teacherId: [{ required: false, message: '请选择指导教师' }],
  classId: [{ required: false, message: '请选择班级' }],
  startDate: [{ required: true, message: '请选择开始时间', type: 'object' }],
};

const showDrawer = () => {
  NPopen.value = true;
}

const onNPClose = () => {
  NPopen.value = false;
}
</script>

<template>
  <a-card title="用户">
    <template #extra><a-button @click="showDrawer" type="primary">新建项目</a-button></template>
    <a-form layout="inline">
      <a-form-item label="创建者 ID">
        <a-input v-model:value="searchParams.creatorId" placeholder="输入创建者 ID" />
      </a-form-item>
      <a-form-item label="班级 ID">
        <a-input v-model:value="searchParams.classId" placeholder="输入班级 ID" />
      </a-form-item>
      <a-form-item label="状态">
        <a-select v-model:value="searchParams.status" placeholder="选择状态">
          <a-select-option value="">未选择</a-select-option>
          <a-select-option value="进行中">进行中</a-select-option>
          <a-select-option value="已完成">已完成</a-select-option>
          <a-select-option value="已取消">已取消</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="审核状态">
        <a-select v-model:value="searchParams.reviewStatus" placeholder="选择审核状态">
          <a-select-option value="">未选择</a-select-option>
          <a-select-option value="待审核">待审核</a-select-option>
          <a-select-option value="审核通过">审核通过</a-select-option>
          <a-select-option value="审核不通过">审核不通过</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" @click="handleSearch">查询</a-button>
      </a-form-item>
      <a-button @click="newProject">新项目</a-button>
    </a-form>
    <a-table :dataSource="users" :loading="loading" rowKey="id" bordered :pagination="pagination"
      @change="handleTableChange">
      <a-table-column title="id" dataIndex="id" key="id" />
      <a-table-column title="用户名" dataIndex="username" key="username" />
      <a-table-column title="角色" dataIndex="role" key="role" />
      <a-table-column title="创建时间" dataIndex="createdAt" key="createdAt" />
    </a-table>
  </a-card>
  <a-drawer title="新建项目" :width="720" :open="NPopen" :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }" @close="onNPClose">
    <a-form :model="PForm" :rules="PFRules" layout="horizontal" @finish="handleNewProject">
      <a-form-item label="姓名" name="name">
        <a-input v-model:value="PForm.name" placeholder="请输入项目名称"></a-input>
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea v-model:value="PForm.description" placeholder="请输入项目描述"></a-textarea>
      </a-form-item>
      <a-button type="primary" html-type="submit">创建</a-button>
    </a-form>
  </a-drawer>
</template>