<script setup lang="ts">
import { api } from '@/assets/api';

const username = api.getCookie("username")

function logout(){
    api.clearCookies();
    window.location.replace("/login");
}

function app(){
    window.location.replace("/app");
}

function login_click() {
    window.location.replace("/login");
}
</script>

<template>
    <a-dropdown v-if="username !== null">
        <a-avatar :size="50" :gap="1" class="ant-dropdown-link" @click="app">
            {{ username }}
        </a-avatar>
        <template #overlay>
            <a-menu>
                <a-menu-item>
                    <a @click="logout">退出登录</a>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
    <a-button v-else type="primary" .onclick="login_click">登录</a-button>
</template>
