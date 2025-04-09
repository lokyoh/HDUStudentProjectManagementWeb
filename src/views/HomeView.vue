<script setup lang="ts">
import Footer from '../components/Footer.vue';
import Header from "../components/Header.vue";
import Anno from "../components/home/Anno.vue";
</script>

<template>
    <a-layout>
        <Header />
        <a-layout-content style="margin-top: 70px;">
            <Anno />
        </a-layout-content>
        <Footer />
    </a-layout>
</template>
