<script setup lang="ts">
import AppHeader from "../components/Header.vue";
import { useRoute } from 'vue-router';
import { reactive, ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";

const route = useRoute();

function fetchTask(id: any) {
    return apiClient.get(`${api.apiUrl}/task/get/${id}`);
}

const load = ref(false);
const task = ref({
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
});

async function loadTask() {
    const tid = route.params.id;
    try {
        const response = await fetchTask(tid);
        task.value = response.data.data;
        load.value = true;
        if (task.value == null) {
            window.location.replace("/404");
        }
    }catch (error){
        console.error("查询失败:", error);
        return
    }
}

loadTask();
</script>

<template>
    <AppHeader />
    <a-layout style="top: 65px; position: relative;" v-show="load">
        <a-layout-content style="margin-left: 5px;">
            <a-card :title="task.name">
                <p>{{ task.description }}</p>
                <a-divider  v-show="task.dueDate"/>
                <p v-show="task.dueDate">截至日期: {{ task.dueDate }}</p>
                <var style="display: flex;justify-content: right;" v-show="task.role == 'leader'">
                    <a-button>修改信息</a-button>
                </var>
            </a-card>
            <a-card title="审核">
                <a-table :dataSource="task.reviews" :loading="!load" rowKey="id" bordered>
                    <a-table-column title="发起时间" dataIndex="createdAt" key="createdAt" />
                    <a-table-column title="状态" dataIndex="status" key="status" />
                    <a-table-column title="审核意见" dataIndex="comments" key="comments" />
                    <a-table-column title="完成时间" dataIndex="reviewedAt" key="reviewedAt" />
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'status'">
                            {{ api.transReviewStatus(record.status) }}
                        </template>
                        <template v-if="column.dataIndex === 'comments'">
                            {{ record.comments? record.comments : '--' }}
                        </template>
                        <template v-if="column.dataIndex === 'reviewedAt'">
                            {{ record.reviewedAt? record.reviewedAt : '--' }}
                        </template>
                    </template>
                </a-table>
                <var style="display: flex;justify-content: right;"
                    v-show="task.role == 'leader' && task.status == 'normal'">
                    <a-button @click="">新审核</a-button>
                </var>
            </a-card>
            <a-card title="文件">
                <a-table :dataSource="task.files" :loading="!load" rowKey="id" bordered>
                    <a-table-column title="任务名称" dataIndex="fileName" key="fileName" />
                    <a-table-column title="任务描述" dataIndex="description" key="description" />
                    <a-table-column title="负责人" dataIndex="studentName" key="studentName" />
                    <a-table-column v-if="task.role=='leader'" title="操作" key="action" />
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'fileName'">
                            <a>
                                {{ record.fileName }}
                            </a>
                        </template>
                        <template v-if="column.key === 'action'">
                            <span>
                                <a>删除</a>
                            </span>
                        </template>
                    </template>
                </a-table>
                <var style="display: flex;justify-content: right;"
                    v-show="(task.role == 'leader' || task.role == 'member') && task.status == 'normal'">
                    <a-button>上传文件</a-button>
                </var>
            </a-card>
        </a-layout-content>
        <a-layout-sider theme="light" style="margin-right: 5px;">
            <a-card title="成员">
                <a-list item-layout="horizontal" :data-source="task.members">
                    <template #renderItem="{ item }">
                        <a-list-item style="display: flex;justify-content: space-between;width: 100%;">
                            {{ item.name }}<a-tag>{{ api.transProjectRole(item.role) }}</a-tag>
                        </a-list-item>
                    </template>
                </a-list>
                <var style="display: flex;justify-content: center;"
                    v-show="task.role == 'leader' && (task.status == 'normal' || task.status == 'plane')">
                    <a-button>添加成员</a-button>
                </var>
            </a-card>
        </a-layout-sider>
    </a-layout>
    <a-layout style="top: 65px; position: relative;" v-show="!load">
        <h1>项目数据加载失败。</h1>
        <router-link to="/">返回首页</router-link>
    </a-layout>
</template>
