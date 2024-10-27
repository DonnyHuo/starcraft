<template>
  <section class="container"></section>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, getCurrentInstance, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const { proxy } = getCurrentInstance() as any;
const store = useStore();
const router = useRouter();
const route = useRoute();
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
}
</style>
