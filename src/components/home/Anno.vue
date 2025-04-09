<script setup lang="ts">
import { ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";

const annos = ref([]);
const loading = ref(false);

function fetchAnnos() {
    return apiClient.get(`${api.apiUrl}/announcement/list`);
}

async function handleAnnos(){
    if (loading.value) return;
    loading.value = true;
    try {
        const response = await fetchAnnos();
        annos.value = response.data.data.items;
        console.log(annos.value)
    } catch (error) {
        console.error("查询失败:", error);
    }
    loading.value = false;
};

handleAnnos();
</script>

<template>
    <a-card title="公告">
        <a-table :dataSource="annos" :loading="loading" rowKey="id" bordered>
            <a-table-column title="题目" dataIndex="title" key="title" />
            <a-table-column title="内容" dataIndex="content" key="content" />
            <a-table-column title="开始时间" dataIndex="startDate" key="startDate" />
            <a-table-column title="结束时间" dataIndex="endDate" key="endDate" />
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'title'">
                    <router-link :to="`/announcement?id=${record.id}`">
                        {{ record.title }}
                    </router-link>
                </template>
            </template>
        </a-table>
    </a-card>
</template>