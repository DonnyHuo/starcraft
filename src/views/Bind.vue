<template>
  <section class="container">
    <HeaderTitle :headTitle="'Bind'" />
    <div class="container" style="display: flex; flex-direction: column; align-items: center; font-size: 24px;">
      <div style="display: flex;flex-direction: column;width: 100%;">
        <div style="margin: 12px 0;padding: 0 24px;">
          <input style="width: 100%;text-align: center;" placeholder="Please enter TON address" v-model="bindAddress" />
        </div>
        <button class="btn1" @click="bind">
          Bind
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ethers } from 'ethers';
import { getSigner } from 'starcraft-sdk';
import { Address } from '@ton/ton'

const store = useStore();
const route = useRoute();
const bindAddress = ref('')

onMounted(() => {
  if (route.query.Bridge) store.commit('Bridge', route.query.Bridge);
});


const bind = () => {
  const addressTon = Address.parse(bindAddress.value);
  const bindAddressHash = addressTon.toRawString().split(":")[1]
  const contract = new ethers.Contract("0x68ed4189be0adbf1ee982b045f338e747909f53d", ["function binTonAddress(bytes32)"], getSigner())
  contract.binTonAddress("0x" + bindAddressHash)
    .then((_: any) => _.wait())
    .then((_: any) => console.log(_))
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  padding: 0 15px;
}

.btn1 {
  width: 100%;
  height: 94px;
  margin: 0 auto;
  background: url('../assets/images/img25.png') no-repeat;
  background-size: 100% 100%;
  font-size: 14px;
  text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
}
</style>
