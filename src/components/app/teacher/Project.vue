<script setup lang="ts">
import { reactive, ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";
import type { Rule } from "ant-design-vue/es/form";

const searchParams = ref({
    creatorId: null,
    classId: null,
    status: null,
    reviewStatus: null,
});

const projects = ref([]);
const loading = ref(false);

function fetchProjects(params: any) {
    return apiClient.get(`${api.apiUrl}/project/list`, { params });
}

async function handleSearch(){
    if (loading.value) return;
    loading.value = true;
    try {
        const response = await fetchProjects(searchParams.value);
        projects.value = response.data.data.items;
    } catch (error) {
        console.error("查询失败:", error);
    }
    loading.value = false;
};

handleSearch();

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
    <a-card title="指导项目">
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
        </a-form>
        <a-table :dataSource="projects" :loading="loading" rowKey="id" bordered>
            <a-table-column title="项目名称" dataIndex="name" key="name" />
            <a-table-column title="描述" dataIndex="description" key="description" />
            <a-table-column title="创建者" dataIndex="creatorName" key="creatorName" />
            <a-table-column title="所属班级" dataIndex="className" key="className" />
            <a-table-column title="状态" dataIndex="status" key="status" />
            <a-table-column title="开始日期" dataIndex="startDate" key="startDate" />
            <a-table-column title="结束日期" dataIndex="endDate" key="endDate" />
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'name'">
                    <router-link :to="`/project/${record.id}`">
                        {{ record.name }}
                    </router-link>
                </template>
                <template v-if="column.dataIndex === 'className'">
                    <router-link :to="`/class/${record.classId}`">
                        {{ record.className }}
                    </router-link>
                </template>
                <template v-if="column.dataIndex === 'status'">
                    {{ api.transProjectStatus(record.status) }}
                </template>
            </template>
        </a-table>
    </a-card>
</template> 