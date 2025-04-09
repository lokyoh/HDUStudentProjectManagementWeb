<script setup lang="ts">
import { ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";

const searchParams = ref({
    creatorId: null,
    classId: null,
    status: null,
    reviewStatus: null,
});

const tasks = ref([]);
const loading = ref(false);

function fetchTasks(params: any) {
    return apiClient.get(`${api.apiUrl}/task/list`, { params });
}

async function handleSearch(){
    if (loading.value) return;
    loading.value = true;
    try {
        const response = await fetchTasks(searchParams.value);
        tasks.value = response.data.data.items;
    } catch (error) {
        console.error("查询失败:", error);
    }
    loading.value = false;
};

handleSearch();
</script>

<template>
    <a-card title="我的任务">
        <a-form layout="inline">
            <a-form-item label="状态">
                <a-select v-model:value="searchParams.status" placeholder="选择状态">
                    <a-select-option value="">未选择</a-select-option>
                    <a-select-option value="进行中">进行中</a-select-option>
                    <a-select-option value="已完成">已完成</a-select-option>
                    <a-select-option value="已取消">已取消</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" @click="handleSearch">查询</a-button>
            </a-form-item>
        </a-form>
        <a-table :dataSource="tasks" :loading="loading" rowKey="id" bordered :scroll="{ x: 'max-content' }">
            <a-table-column title="任务名称" dataIndex="name" key="name" />
            <a-table-column title="任务描述" dataIndex="description" key="description" />
            <a-table-column title="项目名称" dataIndex="projectName" key="projectName" />
            <a-table-column title="负责人" dataIndex="assigner" key="assigner" />
            <a-table-column title="截至时间" dataIndex="dueDate" key="dueDate" />
            <a-table-column title="状态" dataIndex="status" key="status" />
            <a-table-column title="角色" dataIndex="role" key="role" />
            <a-table-column title="分配日期" dataIndex="assignedAt" key="assignedAt" />
            <a-table-column title="进度" dataIndex="progress" key="progress" >
                <template #default="{ text }">
                    {{ text !== null && text !== undefined ? (text * 100).toFixed(2) + '%' : '0%' }}
                </template>
            </a-table-column>
            <a-table-column title="进度描述" dataIndex="progressDescription" key="progressDescription" />
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'name'">
                    <router-link :to="`/task/${record.id}`">
                        {{ record.name }}
                    </router-link>
                </template>
                <template v-if="column.dataIndex === 'projectName'">
                    <router-link :to="`/project/${record.id}`">
                        {{ record.projectName }}
                    </router-link>
                </template>
            </template>
        </a-table>
    </a-card>
</template>