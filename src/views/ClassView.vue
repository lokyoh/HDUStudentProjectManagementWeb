<script setup lang="ts">
import AppHeader from "../components/Header.vue";
import { useRoute } from 'vue-router';
import { reactive, ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";

const route = useRoute();

function fetchClasses(id: any) {
    return apiClient.get(`${api.apiUrl}/class/get/${id}`);
}

const load = ref(false);
const classes = ref({
    id: null,
    name: null,
    description: null,
    semester: null,
    teacherId: null,
    teacherName: null,
    createdAt: null,
    role: null,
    createAt: null,
    members: [{'id':0,'name':null}],
    projects: []
});

async function loadClasses() {
    const tid = route.params.id;
    try {
        const response = await fetchClasses(tid);
        classes.value = response.data.data;
        load.value = true;
        if (classes.value == null) {
            window.location.replace("/404");
        }
    }catch (error){
        console.error("查询失败:", error);
        return
    }
}

loadClasses();
</script>

<template>
    <AppHeader />
    <a-layout style="top: 65px; position: relative;" v-show="load">
        <a-layout-content style="margin-left: 5px;">
            <a-card :title="classes.name">
                <p>{{ classes.description }}</p>
                <var style="display: flex;justify-content: right;" v-show="classes.role=='teacher'">
                    <a-button>修改信息</a-button>
                </var>
            </a-card>
            <a-card title="班级项目">
                <a-table :dataSource="classes.projects" :loading="!load" rowKey="id" bordered>
                    <a-table-column title="项目名称" dataIndex="name" key="name" />
                    <a-table-column title="项目描述" dataIndex="description" key="description" />
                    <a-table-column title="创建者" dataIndex="creatorId" key="creatorId" />
                    <a-table-column title="状态" dataIndex="status" key="status" />
                    <a-table-column title="开始日期" dataIndex="startDate" key="startDate" />
                    <a-table-column title="结束日期" dataIndex="endDate" key="endDate" />
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'name'">
                            <router-link :to="`/project/${record.id}`">
                                {{ record.name }}
                            </router-link>
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            {{ api.transTaskStatus(record.status) }}
                        </template>
                        <template v-if="column.dataIndex === 'creatorId'">
                            {{ classes.members.find(member => member.id === record.creatorId)?.name }}
                        </template>
                        <template v-if="column.dataIndex === 'endDate'">
                            {{ record.endDate? record.endDate : '--' }}
                        </template>
                    </template>
                </a-table>
                <var style="display: flex;justify-content: right;"
                    v-show="classes.role == 'teacher' || classes.role == 'student'">
                    <a-button @click="">新建任务</a-button>
                </var>
            </a-card>
        </a-layout-content>
        <a-layout-sider theme="light" style="margin-right: 5px;">
            <a-card title="教师">
                {{ classes.teacherName }}
            </a-card>
            <a-card title="学生">
                <a-list item-layout="horizontal" :data-source="classes.members">
                    <template #renderItem="{ item }">
                        <a-list-item style="display: flex;justify-content: space-between;width: 100%;">
                            {{ item.name }}
                        </a-list-item>
                    </template>
                </a-list>
                <var style="display: flex;justify-content: center;"
                    v-show="classes.role == 'teacher'">
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
