<script setup lang="ts">
import Footer from '../Footer.vue';
import { ref, computed, defineAsyncComponent } from 'vue';

const selectedKeys = ref<string[]>(['class']);

const content = computed(() => {
  const key = selectedKeys.value[0];
  switch (key) {
    case 'info':
      return defineAsyncComponent(() =>
        import('./teacher/Info.vue')
      );
    case 'review':
      return defineAsyncComponent(() =>
        import('./teacher/Review.vue')
      );
    case 'project':
      return defineAsyncComponent(() =>
        import('./teacher/Project.vue')
      );
    case 'class':
      return defineAsyncComponent(() =>
        import('./teacher/Class.vue')
      );
  }
})
</script>

<template>
  <a-layout style="top: 65px; position: relative;">
    <a-layout-sider theme="light">
      <a-menu mode="inline" v-model:selectedKeys="selectedKeys">
        <a-menu-item key="class">
          <span>我的班级</span>
        </a-menu-item>
        <a-menu-item key="project">
          <span>指导项目</span>
        </a-menu-item>
        <a-menu-item key="review">
          <span>我的审批</span>
        </a-menu-item>
        <a-menu-item key="info">
          <span>我的信息</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <component :is="content" />
      </a-layout-content>
      <a-layout-footer>
        <Footer />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
