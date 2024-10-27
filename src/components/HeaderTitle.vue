<template>
  <div class="pagetitle">
    <img :src="img32" alt="" @click="closePage" />
    <p>{{ props.headTitle }}</p>
  </div>
</template>

<script lang="ts" setup>
import img32 from '@/assets/images/img32.svg';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();

const props = defineProps({
  headTitle: {
    type: String,
    default: ''
  }
});

const closePage = () => {
  router.push('/');
};
</script>

<style lang="scss" scoped>
.pagetitle {
  display: flex;
  align-items: center;
  padding: 15px;
  img {
    width: 42px;
    height: auto;
  }
  p {
    font-size: 20px;
    text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
    margin-left: 5px;
  }
}
</style>
