<script setup lang="ts">
import Footer from '../Footer.vue';
import { ref, computed, defineAsyncComponent } from 'vue';

const selectedKeys = ref<string[]>(['user']);

const content = computed(() => {
  const key = selectedKeys.value[0];
  switch (key) {
    case 'user':
      return defineAsyncComponent(() =>
        import('./admin/User.vue')
      );
    case 'anno':
      return defineAsyncComponent(() =>
        import('./admin/Anno.vue')
      );
    case 'project':
      return defineAsyncComponent(() =>
        import('./admin/Project.vue')
      );
    case 'class':
      return defineAsyncComponent(() =>
        import('./admin/Class.vue')
      );
  }
})
</script>

<template>
  <a-layout style="top: 65px; position: relative;">
    <a-layout-sider theme="light">
      <a-menu mode="inline" v-model:selectedKeys="selectedKeys">
        <a-menu-item key="user">
          <span>用户</span>
        </a-menu-item>
        <a-menu-item key="project">
          <span>项目</span>
        </a-menu-item>
        <a-menu-item key="class">
          <span>班级</span>
        </a-menu-item>
        <a-menu-item key="anno">
          <span>公告</span>
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
