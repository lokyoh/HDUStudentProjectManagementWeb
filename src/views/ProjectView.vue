<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";
import { useRoute } from 'vue-router';
import AppHeader from "../components/Header.vue";
import type { Rule } from "ant-design-vue/es/form";
import { message } from "ant-design-vue";

const route = useRoute();

function fetchProject(id: any) {
    return apiClient.get(`${api.apiUrl}/project/get/${id}`);
}

function fetchProjectMemers(id: any) {
    return apiClient.get(`${api.apiUrl}/project/members/${id}`);
}

function fetchPrjectTasks(id: any) {
    return apiClient.get(`${api.apiUrl}/task/project/${id}`);
}

function fetchProjectFiles(id: any) {
    return apiClient.get(`${api.apiUrl}/file/project/${id}`);
}

const project = ref({
    id: null,
    name: '',
    description: '',
    role: null,
    teacherName: null,
    status: null,
    classId: null,
    className: null,
});
const members = ref([{ id: null }]);
const tasks = ref([]);
const files = ref([]);
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
        projectParam.name = project.value.name
        projectParam.description = project.value.description
        PForm.projectId = project.value.id;
    } catch (error) {
        console.error("查询失败:", error);
        return
    }
    try {
        const mr = await fetchProjectMemers(pid);
        members.value = mr.data.data;
        PForm.assignedTo = members.value[0].id
    } catch (error) {
        console.error("查询失败:", error);
    }
    if (project.value.role != null) {
        tload.value = true;
        try {
            const tr = await fetchPrjectTasks(pid);
            tasks.value = tr.data.data;
        } catch (error) {
            console.error("查询失败:", error);
        }
        tload.value = false;
    }
    fload.value = true;
    try {
        const fr = await fetchProjectFiles(pid);
        files.value = fr.data.data;
    } catch (error) {
        console.error("查询失败:", error);
    }
    fload.value = false;
};

onMounted(loadProject);

const projectParam = reactive({
    id: route.params.id,
    name: '',
    description: '',
});

async function changeInfo() {
    try {
        const response = await apiClient.put(`${api.apiUrl}/project/student/change`, projectParam);
        const data = response.data;
        if (data.code === 0) {
            message.success(data.message);
            loadProject();
            Popen.value = false;
        } else {
            message.error(data.message)
        }
    } catch (error) {
        console.error("请求失败:", error);
    }
}

const PDRules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入项目名称' }],
    description: [{ required: true, message: '请输入项目描述' }],
};

const Popen = ref<boolean>(false);

const showPDrawer = () => {
    Popen.value = true;
}

const onPClose = () => {
    Popen.value = false;
}

const NPopen = ref<boolean>(false);

const PForm = reactive({
    projectId: null,
    name: '',
    description: '',
    assignedTo: null,
});

const PFRules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入项目名称' }],
    description: [{ required: true, message: '请输入项目描述' }],
};

const showDrawer = () => {
    NPopen.value = true;
}

const onNPClose = () => {
    NPopen.value = false;
}

async function newTask() {
    try {
        const response = await apiClient.put(`${api.apiUrl}/task/create`, PForm);
        const data = response.data;
        if (data.code === 0) {
            message.success(data.message);
            loadProject();
            NPopen.value = false;
        } else {
            message.error(data.message)
        }
    } catch (error) {
        console.error("请求失败:", error);
    }
}

async function addMember() {
    try {
        const response = await apiClient.post(`${api.apiUrl}/project/student/addMember?pid=${route.params.id}&sid=${MemberForm.sid}`);
        const data = response.data;
        if (data.code === 0) {
            message.success(data.message);
            loadProject();
            Mopen.value = false;
        } else {
            message.error(data.message)
        }
    } catch (error) {
        console.error("请求失败:", error);
    }
}

const classMembers = ref([])

const Mopen = ref<boolean>(false);

const MemberForm = reactive({
    sid: null,
})

const MDRules: Record<string, Rule[]> = {
    sid: [{ required: true, message: '请选择' }],
};

async function showMDrawer() {
    try {
        MemberForm.sid = null;
        const response = await apiClient.get(`${api.apiUrl}/class/get/${project.value.classId}`);
        const cm = response.data.data.members;
        const m = new Set(members.value.map(item => item.id));
        classMembers.value = cm.filter((item: { id: null; }) => !m.has(item.id));
    } catch (error) {
        console.error("查询失败:", error);
        return
    }
    Mopen.value = true;
}

const onMClose = () => {
    Mopen.value = false;
}
</script>

<template>
    <AppHeader />
    <a-layout style="top: 65px; position: relative;" v-show="load">
        <a-layout-content style="margin-left: 5px;">
            <a-card :title="project.name">
                <p>{{ project.description }}</p>
                <var style="display: flex;justify-content: right;"
                    v-show="project.role == 'leader' && project.status == 'normal'">
                    <a-button @click="showPDrawer">修改信息</a-button>
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
                    <a-button @click="showDrawer">新建任务</a-button>
                </var>
            </a-card>
            <a-card title="文件">
                <a-table :dataSource="files" :loading="fload" rowKey="id" bordered>
                    <a-table-column title="任务名称" dataIndex="fileName" key="fileName" />
                    <a-table-column title="任务描述" dataIndex="description" key="description" />
                    <a-table-column title="负责人" dataIndex="studentName" key="studentName" />
                    <a-table-column v-if="project.role == 'leader'" title="操作" key="action" />
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
                    <a-upload name="file">
                        <a-button>
                            上传文件
                        </a-button>
                    </a-upload>
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
                    <a-button @click="">添加导师</a-button>
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
                    <a-button @click="showMDrawer">添加成员</a-button>
                </var>
            </a-card>
        </a-layout-sider>
    </a-layout>
    <a-layout style="top: 65px; position: relative;" v-show="!load">
        <h1>项目数据加载失败。</h1>
        <router-link to="/">返回首页</router-link>
    </a-layout>
    <a-drawer title="新建任务" :width="720" :open="NPopen" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onNPClose">
        <a-form :model="PForm" :rules="PFRules" layout="horizontal" @finish="newTask">
            <a-form-item label="任务名" name="name">
                <a-input v-model:value="PForm.name" placeholder="请输入任务名称"></a-input>
            </a-form-item>
            <a-form-item label="任务描述" name="description">
                <a-textarea v-model:value="PForm.description" placeholder="请输入任务描述"></a-textarea>
            </a-form-item>
            <p>负责人:
                <a-select v-model:value="PForm.assignedTo" style="width: 150px;" :options="members"
                    :field-names="{ label: 'name', value: 'id' }" />
            </p>
            <a-button type="primary" html-type="submit">创建</a-button>
        </a-form>
    </a-drawer>
    <a-drawer title="修改信息" :width="720" :open="Popen" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onPClose">
        <a-form :model="projectParam" :rules="PDRules" layout="horizontal" @finish="changeInfo">
            <a-form-item label="名称" name="name">
                <a-input v-model:value="projectParam.name" placeholder="请输入任务名称"></a-input>
            </a-form-item>
            <a-form-item label="描述" name="description">
                <a-textarea v-model:value="projectParam.description" placeholder="请输入任务描述"></a-textarea>
            </a-form-item>
            <a-button type="primary" html-type="submit">修改</a-button>
        </a-form>
    </a-drawer>
    <a-drawer title="添加成员" :width="720" :open="Mopen" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onMClose">
        <a-form :model="MemberForm" :rules="MDRules" layout="horizontal" @finish="addMember">
            <a-form-item label="学生" name="id"><a-select v-model:value="MemberForm.sid" style="width: 150px;"
                    :options="classMembers" :field-names="{ label: 'name', value: 'id' }"></a-select></a-form-item>
            <a-button type="primary" html-type="submit">添加</a-button>
        </a-form>
    </a-drawer>
</template>
