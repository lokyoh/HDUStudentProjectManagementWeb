<script setup lang="ts">
import { ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";
import { useRoute } from 'vue-router';
import AppHeader from "../components/Header.vue";

const route = useRoute();

function fetchProject(id: any) {
    return apiClient.get(`${api.apiUrl}/project/get/${id}`);
}

function fetchMemers(id: any) {
    return apiClient.get(`${api.apiUrl}/project/members/${id}`);
}

function fetchTask(id: any) {
    return apiClient.get(`${api.apiUrl}/task/project/${id}`);
}

function fetchProjectFile(id: any) {
    return apiClient.get(`${api.apiUrl}/file/project/${id}`);
}

const project = ref({
    name: null,
    description: null,
    role: null,
    teacherName: null,
    status: null,
    classId: null,
    className: null,
});
const members = ref([]);
const tasks = ref([]);
const files = ref([{
    fileName: 'file1',
    description: 'file1',
    studentName: 'lokyoh',
}]);
const load = ref(false);
const tload = ref(true);
const fload = ref(true);

async function loadProject() {
    const pid = route.params.id;
    try {
        const response = await fetchProject(pid);
        project.value = response.data.data;
        load.value = true;
        if (project.value == null) {
            window.location.replace("/404");
        }

    } catch (error) {
        console.error("查询失败:", error);
    }
    try {
        const mr = await fetchMemers(pid);
        members.value = mr.data.data;
    } catch (error) {
        console.error("查询失败:", error);
    }
    if (project.value.role != null) {
        tload.value = true;
        try {
            const tr = await fetchTask(pid);
            tasks.value = tr.data.data;
        } catch (error) {
            console.error("查询失败:", error);
        }
        tload.value = false;
    }
    fload.value = true;
    try {
        const fr = await fetchProjectFile(pid);
        files.value = fr.data.data;
    } catch (error) {
        console.error("查询失败:", error);
    }
    files.value = [{
        fileName: 'file1',
        description: 'file1',
        studentName: 'lokyoh',
    },{
        fileName: 'file2',
        description: 'file2',
        studentName: 'lokyoh',
    },]
    fload.value = false;
};

loadProject();
</script>

<template>
    <AppHeader />
    <a-layout style="top: 65px; position: relative;" v-show="load">
        <a-layout-content style="margin-left: 5px;">
            <a-card :title="project.name">
                <p>{{ project.description }}</p>
                <var style="display: flex;justify-content: right;"
                    v-show="project.role == 'leader' && project.status == 'normal'">
                    <a-button>修改信息</a-button>
                </var>
            </a-card>
            <a-card title="任务" v-show="project.role != null">
                <a-table :dataSource="tasks" :loading="tload" rowKey="id" bordered>
                    <a-table-column title="任务名称" dataIndex="name" key="name" />
                    <a-table-column title="任务描述" dataIndex="description" key="description" />
                    <a-table-column title="负责人" dataIndex="assigner" key="assigner" />
                    <a-table-column title="状态" dataIndex="status" key="status" />
                    <a-table-column title="截至日期" dataIndex="dueDate" key="dueDate" />
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'name'">
                            <router-link :to="`/task/${record.id}`">
                                {{ record.name }}
                            </router-link>
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            {{ api.transTaskStatus(record.status) }}
                        </template>
                    </template>
                </a-table>
                <var style="display: flex;justify-content: right;"
                    v-show="project.role == 'leader' && project.status == 'normal'">
                    <a-button>新建任务</a-button>
                </var>
            </a-card>
            <a-card title="文件">
                <a-table :dataSource="files" :loading="fload" rowKey="id" bordered>
                    <a-table-column title="任务名称" dataIndex="fileName" key="fileName" />
                    <a-table-column title="任务描述" dataIndex="description" key="description" />
                    <a-table-column title="负责人" dataIndex="studentName" key="studentName" />
                    <a-table-column v-if="project.role=='leader'" title="操作" key="action" />
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
                    v-show="(project.role == 'leader' || project.role == 'member') && project.status == 'normal'">
                    <a-button>上传文件</a-button>
                </var>
            </a-card>
        </a-layout-content>
        <a-layout-sider theme="light" style="margin-right: 5px;">
            <a-card title="指导教师">
                <p v-show="project.teacherName != null">
                    {{ project.teacherName }}
                </p>
                <var style="display: flex;justify-content: center;"
                    v-show="project.role == 'leader' && project.teacherName == null && project.status == 'normal'">
                    <a-button>添加导师</a-button>
                </var>
            </a-card>
            <a-card title="所属班级" v-show="project.classId != null">
                <p>
                    <router-link :to="`/class/${project.classId}`">
                        {{ project.className }}
                    </router-link>
                </p>
            </a-card>
            <a-card title="成员">
                <a-list item-layout="horizontal" :data-source="members">
                    <template #renderItem="{ item }">
                        <a-list-item style="display: flex;justify-content: space-between;width: 100%;">
                            {{ item.name }}<a-tag>{{ api.transProjectRole(item.role) }}</a-tag>
                        </a-list-item>
                    </template>
                </a-list>
                <var style="display: flex;justify-content: center;"
                    v-show="project.role == 'leader' && project.status == 'normal'">
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
