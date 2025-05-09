<script setup lang="ts">
import { ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";

const searchParams = ref({
    tid: null,
});

const classes = ref([]);
const loading = ref(false);

function fetchClasses(params: any) {
    return apiClient.get(`${api.apiUrl}/class/list`, { params });
}

async function handleSearch(){
    if (loading.value) return;
    loading.value = true;
    try {
        const response = await fetchClasses(searchParams.value);
        classes.value = response.data.data.items;
    } catch (error) {
        console.error("查询失败:", error);
    }
    loading.value = false;
};

handleSearch();
</script>

<template>
    <a-card title="我的班级" style="max-width: 800px; margin: auto;">
        <template #extra><a-button @click="" type="primary">新建班级</a-button></template>
        <a-form layout="inline">
            <a-form-item>
                <!-- <a-button type="primary" html-type="submit" @click="handleSearch">刷新</a-button> -->
            </a-form-item>
        </a-form>
        <a-table :dataSource="classes" :loading="loading" rowKey="id" bordered>
            <a-table-column title="班级名称" dataIndex="name" key="name" />
            <a-table-column title="描述" dataIndex="description" key="description" />
            <a-table-column title="学期" dataIndex="semester" key="semester" />
            <a-table-column title="创建时间" dataIndex="createdAt" key="createdAt" />
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'name'">
                    <router-link :to="`/class/${record.id}`">
                        {{ record.name }}
                    </router-link>
                </template>
            </template>
        </a-table>
    </a-card>
</template> 