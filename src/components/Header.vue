<script setup lang="ts">
import { type CSSProperties } from 'vue';
import Avatar from './header/Avatar.vue';

const headerStyle: CSSProperties = {
    color: '#fff',
    height: 64,
    backgroundColor: '#7dbcea',
    fontSize: '40px',
    position: 'fixed',
    width: '100%',
    display: "flex",
    justifyContent: 'space-between',
    padding: '10px',
};
</script>

<template>
    <a-layout-header :style="headerStyle">
        杭电学生项目管理系统
        <Avatar />
    </a-layout-header>
</template>
