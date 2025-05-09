<script setup lang="ts">
import AppHeader from "../components/Header.vue";
import { useRoute } from 'vue-router';
import { onMounted, reactive, ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";
import router from "@/router";
import { message } from "ant-design-vue";

if (api.getCookie('role') !== 'teacher'){
    router.go(-1);
}

const route = useRoute();

function fetchReview(id: any) {
    return apiClient.get(`${api.apiUrl}/review/get/${id}`);
}

const load = ref(false);
const review = ref({
    id: null,
    taskId: null,
    taskName: null,
    projectId: null,
    projectName: null,
    auditorId: null,
    status: null,
    comments: null,
    createdAt: null,
    reviewedAt: null,
    task: {
        id: null,
        projectId: null,
        name: null,
        description: null,
        assignedTo: null,
        dueDate: null,
        role: null,
        createAt: null,
        status: null,
        members: [],
        reviews: [],
        files: [],
        progerss: {}
    },
    project: {
        name: null,
        description: null,
        role: null,
        teacherName: null,
        status: null,
        classId: null,
        className: null,
    },
})

async function loadReview() {
    const tid = route.params.id;
    try {
        const response = await fetchReview(tid);
        review.value = response.data.data;
        load.value = true;
        if (review.value == null) {
            window.location.replace("/404");
        }else if(review.value.task == null || review.value.project == null){
            window.location.replace("/404");
        }
    }catch (error){
        console.error("查询失败:", error);
        return
    }
}

onMounted(loadReview);

const result = ref({
    id: null,
    status: 'pass',
    comments: '',
});

async function submitReview() {
    try {
        result.value.id = review.value.id
        const response = await apiClient.post(`${api.apiUrl}/review/check`, result.value);
        const data = response.data;
        if (data.code === 0) {
            message.success(data.message);
            loadReview();
        } else {
            message.error(data.message)
        }
    } catch (error) {
        console.error("请求失败:", error);
    }
}
</script>

<template>
    <AppHeader />
    <a-layout style="top: 65px; position: relative;" v-show="load">
        <a-layout-content style="margin-left: 5px;">
            <a-card :title="'项目:' + review.project.name">
                <p>{{ review.project.description }}</p>
            </a-card>
            <a-card :title="'任务:' + review.task.name">
                <p>{{ review.task.description }}</p>
            </a-card>
            <a-card title="文件">
                <a-table :dataSource="review.task.files" :loading="!load" rowKey="id" bordered>
                    <a-table-column title="任务名称" dataIndex="fileName" key="fileName" />
                    <a-table-column title="任务描述" dataIndex="description" key="description" />
                    <a-table-column title="负责人" dataIndex="studentName" key="studentName" />
                </a-table>
            </a-card>
            <a-card title="审批内容" v-show="review.status === 'pending'">
                <var>
                    结果:
                    <a-select style="width: 100px;" v-model:value="result.status">
                        <a-select-option value="pass">通过</a-select-option>
                        <a-select-option value="fail">不通过</a-select-option>
                    </a-select>
                </var>
                <var>
                    <p>意见:</p>
                    <a-textarea v-model:value="result.comments"></a-textarea>
                </var>
                <var style="display: flex;justify-content: center;margin-top: 10px;">
                    <a-button @click="submitReview">提交</a-button>
                </var>
            </a-card>
        </a-layout-content>
        <a-layout-sider theme="light" style="margin-right: 5px;">
            <a-card title="成员">
                <a-list item-layout="horizontal" :data-source="review.task.members">
                    <template #renderItem="{ item }">
                        <a-list-item style="display: flex;justify-content: space-between;width: 100%;">
                            {{ item.name }}<a-tag>{{ api.transProjectRole(item.role) }}</a-tag>
                        </a-list-item>
                    </template>
                </a-list>
            </a-card>
        </a-layout-sider>
    </a-layout>
    <a-layout style="top: 65px; position: relative;" v-show="!load">
        <h1>项目数据加载失败。</h1>
        <router-link to="/">返回首页</router-link>
    </a-layout>
</template>
