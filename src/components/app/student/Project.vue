<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";
import type { Rule } from "ant-design-vue/es/form";
import dayjs, { Dayjs } from 'dayjs';
import { message } from 'ant-design-vue';

const searchParams = ref({
    creatorId: null,
    classId: null,
    teacherId: null,
    status: null,
});

const params = ref({
    classes: [{ id: null, name: null }],
    creators: [{ id: null, name: null }],
    teachers: [{ id: null, name: null }],
})

const projects = ref([]);
const loading = ref(false);

function fetchProjects(params: any) {
    return apiClient.get(`${api.apiUrl}/project/list`, { params });
}

function fetchParams() {
    return apiClient.get(`${api.apiUrl}/project/search/params`)
}

async function handleSearch() {
    if (loading.value) return;
    loading.value = true;
    try {
        const response = await fetchProjects(searchParams.value);
        projects.value = response.data.data.items;
    } catch (error) {
        console.error("查询失败:", error);
    }
    loading.value = false;
};

async function getParams() {
    try {
        const response = await fetchParams();
        params.value = response.data.data;
    } catch (error) {
        console.error("查询失败:", error);
    }
};

onMounted(handleSearch);
onMounted(getParams);

const teacherParam = ref("")
const teacherList = ref([{ uid: null, name: null, id: null }])
teacherList.value = []
async function fetchTeacher() {
    try {
        const response = await apiClient.get(`${api.apiUrl}/user/teacher/param`, { params: { teacher: teacherParam.value } });
        teacherList.value = response.data.data;
    } catch (error) {
        console.error("查询失败:", error);
    }
}

const formattedTeacherList = computed(() => {
    return teacherList.value.map(item => ({
        ...item,
        formattedLabel: `${item.name}-${item.id}`,
    }));
});

function newProject() {
    return apiClient.put(`${api.apiUrl}/project/student/create`, PForm);
}

async function handleNewProject() {
    try {
        const response = await newProject();
        const data = response.data;
        if (data.code === 0) {
            message.success(data.message);
            PForm.name = '';
            PForm.description = '';
            PForm.teacherId = null;
            PForm.startDate = dayjs();
            NPopen.value = false;
            handleSearch();
            getParams();
        } else {
            message.error(data.message)
        }
    } catch (error) {
        console.error("请求失败:", error);
    }
}

const NPopen = ref<boolean>(false);

const PForm = reactive({
    name: '',
    description: '',
    teacherId: null,
    startDate: dayjs(),
});

const PFRules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入项目名称' }],
    description: [{ required: true, message: '请输入项目描述' }],
    teacherId: [{ required: false, message: '请选择指导教师' }],
    startDate: [{ required: true, message: '请选择开始时间' }],
};

const showDrawer = () => {
    NPopen.value = true;
}

const onNPClose = () => {
    NPopen.value = false;
}

const onSelect = (value: Dayjs) => {
    PForm.startDate = value;
};
</script>

<template>
    <a-card title="我的项目" style="min-height: 50vh;">
        <template #extra><a-button @click="showDrawer" type="primary">新建项目</a-button></template>
        <a-form layout="inline">
            <a-form-item label="创建者">
                <a-select v-model:value="searchParams.creatorId" placeholder="请选择" :options="params.creators"
                    :field-names="{ label: 'name', value: 'id' }" allow-clear />
            </a-form-item>
            <a-form-item label="班级">
                <a-select v-model:value="searchParams.classId" placeholder="请选择" :options="params.classes"
                    :field-names="{ label: 'name', value: 'id' }" allow-clear />
            </a-form-item>
            <a-form-item label="指导老师">
                <a-select v-model:value="searchParams.teacherId" placeholder="请选择" :options="params.teachers"
                    :field-names="{ label: 'name', value: 'id' }" allow-clear />
            </a-form-item>
            <a-form-item label="状态">
                <a-select v-model:value="searchParams.status" placeholder="请选择" allow-clear>
                    <a-select-option value="normal">进行中</a-select-option>
                    <a-select-option value="finish">已完成</a-select-option>
                    <a-select-option value="cancel">已取消</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" @click="handleSearch">查询</a-button>
            </a-form-item>
        </a-form>
        <a-table :dataSource="projects" :loading="loading" rowKey="id" bordered>
            <a-table-column title="项目名称" dataIndex="name" key="name" />
            <a-table-column title="描述" dataIndex="description" key="description" />
            <a-table-column title="创建者" dataIndex="creatorName" key="creatorName" />
            <a-table-column title="所属班级" dataIndex="className" key="className" />
            <a-table-column title="状态" dataIndex="status" key="status" />
            <a-table-column title="开始日期" dataIndex="startDate" key="startDate" />
            <a-table-column title="结束日期" dataIndex="endDate" key="endDate" />
            <a-table-column title="角色" dataIndex="role" key="role" />
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'name'">
                    <router-link :to="`/project/${record.id}`">
                        {{ record.name }}
                    </router-link>
                </template>
                <template v-if="column.dataIndex === 'className'">
                    <router-link :to="`/class/${record.classId}`">
                        {{ record.className }}
                    </router-link>
                </template>
                <template v-if="column.dataIndex === 'role'">
                    {{ api.transProjectRole(record.role) }}
                </template>
                <template v-if="column.dataIndex === 'status'">
                    {{ api.transProjectStatus(record.status) }}
                </template>
                <template v-if="column.dataIndex === 'endDate'">
                    {{ record.endDate ? record.endDate : '未定' }}
                </template>
            </template>
        </a-table>
    </a-card>
    <a-drawer title="新建项目" :width="720" :open="NPopen" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onNPClose">
        <a-form :model="PForm" :rules="PFRules" layout="horizontal" @finish="handleNewProject">
            <a-form-item label="名称" name="name">
                <a-input v-model:value="PForm.name" placeholder="请输入项目名称"></a-input>
            </a-form-item>
            <a-form-item label="描述" name="description">
                <a-textarea v-model:value="PForm.description" placeholder="请输入项目描述"></a-textarea>
            </a-form-item>
            <a-input v-model:value="teacherParam" placeholder="请输入教师号或名称" style="width: 150px;"></a-input>
            <a-button @click="fetchTeacher">查询</a-button><br>
            <p>指导教师
                <a-select v-model:value="PForm.teacherId" placeholder="请选择" style="width: 150px;"
                    :options="formattedTeacherList" :field-names="{ label: 'formattedLabel', value: 'uid' }"
                    allow-clear />
            </p>
            <a-form-item label="开始日期" name="startDate">
                {{ PForm.startDate.format('YYYY-MM-DD') }}
            </a-form-item>
            <div :style="{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px', marginBottom: '10px' }">
                <a-calendar :value="PForm.startDate" @select="onSelect" :fullscreen="false" />
            </div>
            <a-button type="primary" html-type="submit">创建</a-button>
        </a-form>
    </a-drawer>
</template>