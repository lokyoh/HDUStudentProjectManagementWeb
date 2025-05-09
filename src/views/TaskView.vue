<script setup lang="ts">
import AppHeader from "../components/Header.vue";
import { useRoute } from 'vue-router';
import { onMounted, reactive, ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";

const route = useRoute();

function fetchTask(id: any) {
    return apiClient.get(`${api.apiUrl}/task/get/${id}`);
}
function fetchProject(id: any) {
    return apiClient.get(`${api.apiUrl}/project/get/${id}`);
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

async function loadTask() {
    const tid = route.params.id;
    try {
        const response = await fetchTask(tid);
        task.value = response.data.data;
        const presponse = await fetchProject(task.value.projectId);
        project.value = presponse.data.data;
        load.value = true;
        if (task.value == null) {
            window.location.replace("/404");
        }
    }catch (error){
        console.error("查询失败:", error);
        return
    }
}

onMounted(loadTask);

// 更改任务信息
const taskParam = reactive({
    id: route.params.id,
    name: '',
    description: '',
});

async function changeTaskInfo() {
    try {
        const response = await apiClient.put(`${api.apiUrl}/task/change`, taskParam);
        const data = response.data;
        if (data.code === 0) {
            message.success(data.message);
            loadTask();
            taskInfoOpen.value = false;
        } else {
            message.error(data.message)
        }
    } catch (error) {
        console.error("请求失败:", error);
    }
}

const taskInfoRules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入项目名称' }],
    description: [{ required: true, message: '请输入项目描述' }],
};

const taskInfoOpen = ref<boolean>(false);

const showTaskInfoDrawer = () => {
    taskInfoOpen.value = true;
}

const onTaskInfoClose = () => {
    taskInfoOpen.value = false;
}

// 添加任务成员
async function addTaskMember() {
    try {
        const response = await apiClient.post(`${api.apiUrl}/task/student/add?tid=${route.params.id}&sid=${taskMemberForm.sid}`);
        const data = response.data;
        if (data.code === 0) {
            message.success(data.message);
            loadTask();
            taskMemberOpen.value = false;
        } else {
            message.error(data.message)
        }
    } catch (error) {
        console.error("请求失败:", error);
    }
}

const taskMembers = ref([])

const taskMemberOpen = ref<boolean>(false);

const taskMemberForm = reactive({
    sid: null,
})

const taskMemberRules: Record<string, Rule[]> = {
    sid: [{ required: true, message: '请选择' }],
};

async function showTaskMemberDrawer() {
    try {
        taskMemberForm.sid = null;
        const response = await apiClient.get(`${api.apiUrl}/project/members/${task.value.projectId}`);
        const tm = response.data.data;
        const m = new Set(task.value.members.map((item: { id: null; }) => item.id));
        taskMembers.value = tm.filter((item: { id: null; }) => !m.has(item.id));
    } catch (error) {
        console.error("查询失败:", error);
        return
    }
    taskMemberOpen.value = true;
}

const ontaskMemberClose = () => {
    taskMemberOpen.value = false;
}

// 新建审查

async function newReview() {
    try {
        const response = await apiClient.post(`${api.apiUrl}/review/new?id=${route.params.id}`);
        const data = response.data;
        if (data.code === 0) {
            message.success(data.message);
            loadTask();
        } else {
            message.error(data.message)
        }
    } catch (error) {
        console.error("请求失败:", error);
    }
}

async function delReview(id: any) {
    try {
        const response = await apiClient.post(`${api.apiUrl}/review/del?id=${id}`);
        const data = response.data;
        if (data.code === 0) {
            message.success(data.message);
            loadTask();
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
            <a-card :title="task.name">
                <p>{{ task.description }}</p>
                <a-divider  v-show="task.dueDate"/>
                <p v-show="task.dueDate">截至日期: {{ task.dueDate }}</p>
                <var style="display: flex;justify-content: right;" v-show="task.role == 'leader'">
                    <a-button @click="showTaskInfoDrawer">修改信息</a-button>
                </var>
            </a-card>
            <a-card title="审核" v-show="project.teacherName">
                <a-table :dataSource="task.reviews" :loading="!load" rowKey="id" bordered>
                    <a-table-column title="发起时间" dataIndex="createdAt" key="createdAt" />
                    <a-table-column title="状态" dataIndex="status" key="status" />
                    <a-table-column title="审核意见" dataIndex="comments" key="comments" />
                    <a-table-column title="完成时间" dataIndex="reviewedAt" key="reviewedAt" />
                    <a-table-column v-if="task.role=='leader'" title="操作" key="action" />
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
                        <template v-if="column.key === 'action'">
                            <span>
                                <a @click="delReview(record.id)" v-if="record.status === 'pending'">取消</a>
                            </span>
                        </template>
                    </template>
                </a-table>
                <var style="display: flex;justify-content: right;"
                    v-show="task.role == 'leader' && task.status == 'normal'">
                    <a-button @click="newReview">新审核</a-button>
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
                    v-show="(task.role == 'leader' || task.role == 'member') && task.status != 'finish'">
                    <a-upload name="file">
                        <a-button>
                            上传文件
                        </a-button>
                    </a-upload>
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
                    <a-button @click="showTaskMemberDrawer">添加成员</a-button>
                </var>
            </a-card>
        </a-layout-sider>
    </a-layout>
    <a-layout style="top: 65px; position: relative;" v-show="!load">
        <h1>项目数据加载失败。</h1>
        <router-link to="/">返回首页</router-link>
    </a-layout>
    <a-drawer title="修改信息" :width="720" :open="taskInfoOpen" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onTaskInfoClose">
        <a-form :model="taskParam" :rules="taskInfoRules" layout="horizontal" @finish="changeTaskInfo">
            <a-form-item label="名称" name="name">
                <a-input v-model:value="taskParam.name" placeholder="请输入任务名称"></a-input>
            </a-form-item>
            <a-form-item label="描述" name="description">
                <a-textarea v-model:value="taskParam.description" placeholder="请输入任务描述"></a-textarea>
            </a-form-item>
            <a-button type="primary" html-type="submit">修改</a-button>
        </a-form>
    </a-drawer>
    <a-drawer title="添加成员" :width="720" :open="taskMemberOpen" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="ontaskMemberClose">
        <a-form :model="taskMemberForm" :rules="taskMemberRules" layout="horizontal" @finish="addTaskMember">
            <a-form-item label="学生" name="id"><a-select v-model:value="taskMemberForm.sid" style="width: 150px;"
                    :options="taskMembers" :field-names="{ label: 'name', value: 'id' }"></a-select></a-form-item>
            <a-button type="primary" html-type="submit">添加</a-button>
        </a-form>
    </a-drawer>
</template>
