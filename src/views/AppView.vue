<script setup lang="ts">
import { api } from "../assets/api.ts";
import AppHeader from "../components/Header.vue";
import AdminPannel from "../components/app/AdminPannel.vue";
import StudentPannel from "../components/app/StudentPannel.vue";
import TeacherPannel from "../components/app/TeacherPannel.vue";

let Pannel = AdminPannel
let role = api.getCookie("role");
if (role) {
    switch (role) {
        case "student":
            Pannel = StudentPannel;
            break;
        case "teacher":
            Pannel = TeacherPannel;
            break;
        case "admin":
            break;
        default:
            api.clearCookies()
            window.location.replace("./login");
    }
} else {
    window.location.replace("./login");
}

</script>

<template>
    <AppHeader />
    <Pannel />
</template>
