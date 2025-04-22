<script setup lang="ts">
import { ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";

const searchParams = ref({
    // creatorId: null,
    // classId: null,
    // status: null,
    // reviewStatus: null,
});

const tasks = ref([]);
const loading = ref(false);

function fetchTasks(params: any) {
    return apiClient.get(`${api.apiUrl}/review/list`, { params });
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
    <a-card title="我的审批">
        <!-- <a-form layout="inline">
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
        </a-form> -->
        <a-table :dataSource="tasks" :loading="loading" rowKey="id" bordered :scroll="{ x: 'max-content' }">
            <a-table-column title="任务名称" dataIndex="taskName" key="taskName" />
            <a-table-column title="项目名称" dataIndex="projectName" key="projectName" />
            <a-table-column title="状态" dataIndex="status" key="status" />
            <a-table-column title="申请日期" dataIndex="createdAt" key="createdAt" />
            <a-table-column title="审批日期" dataIndex="reviewedAt" key="reviewedAt" />
            <a-table-column title="操作" dataIndex="action" key="action" />
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'taskName'">
                    <router-link :to="`/task/${record.id}`">
                        {{ record.taskName }}
                    </router-link>
                </template>
                <template v-if="column.dataIndex === 'projectName'">
                    <router-link :to="`/project/${record.id}`">
                        {{ record.projectName }}
                    </router-link>
                </template>
                <template v-if="column.dataIndex === 'status'">
                    {{ api.transReviewStatus(record.status) }}
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <span v-if="record.status !== 'pending'">
                        已审批
                    </span>
                    <span v-else>
                        <router-link :to="`/review/${record.id}`">
                            审批
                        </router-link>
                    </span>
                </template>
            </template>
        </a-table>
    </a-card>
</template>