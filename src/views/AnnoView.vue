<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "@/assets/api";
import apiClient from "@/assets/api";
import { useRoute } from 'vue-router';

const route = useRoute();

function fetchAnno(id: any) {
    return apiClient.get(`${api.apiUrl}/announcement/get/${id}`);
}

const anno = ref({
    id: null,
    title: null,
    content: null,
    authorId: null,
    authorName: null,
    startDate: null,
    endDate: null,
    status: null,
    createDate: null,
    updateDate: null,
})
const load = ref(false);

async function loadAnno() {
    const aid = route.params.id;
    try {
        const response = await fetchAnno(aid);
        anno.value = response.data.data;
        load.value = true;
        if (anno.value == null) {
            window.location.replace("/404");
        }
    } catch (error) {
        console.error("查询失败:", error);
    }
}

onMounted(loadAnno);
</script>

<template>
    {{ anno.title }} <br>
    {{ anno }}
</template>
