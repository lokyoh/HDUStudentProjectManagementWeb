<script setup lang="ts">
import type { CSSProperties } from 'vue';

const footerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};
</script>

<template>
    <a-layout-footer :style="footerStyle">
        ©2025 <a href="https://blog.lokyoh.com">lokyoh</a>
    </a-layout-footer>
</template>