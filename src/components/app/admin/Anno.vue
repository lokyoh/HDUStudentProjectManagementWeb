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

const annos = ref([]);
const loading = ref(false);

function fetchAnnos(params: any) {
    return apiClient.get(`${api.apiUrl}/announcement/list`, { params });
}

async function handleSearch(){
    if (loading.value) return;
    loading.value = true;
    try {
        const response = await fetchAnnos(searchParams.value);
        annos.value = response.data.data.items;
    } catch (error) {
        console.error("查询失败:", error);
    }
    loading.value = false;
};

handleSearch();
</script>

<template>
    <a-card title="公告">
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
        <a-table :dataSource="annos" :loading="loading" rowKey="id" bordered>
            <a-table-column title="题目" dataIndex="title" key="title" />
            <a-table-column title="内容" dataIndex="content" key="content" />
            <a-table-column title="开始时间" dataIndex="startDate" key="startDate" />
            <a-table-column title="结束时间" dataIndex="endDate" key="endDate" />
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'title'">
                    <router-link :to="`/announcement/${record.id}`">
                        {{ record.title }}
                    </router-link>
                </template>
            </template>
        </a-table>
    </a-card>
</template>