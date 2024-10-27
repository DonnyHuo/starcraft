<template>
  <section class="container">
    <HeaderTitle :headTitle="'Invitation Relationship'" />
    <div class="container2">
      <img class="banner" :src="img26" alt="" />
      <template v-if="!parentAddress">
        <input type="text" v-model="inputVal" placeholder="Enter the address of your inviter …" />
        <button class="btn1" @click="toBind">Bind inviter</button>
      </template>
      <button class="btn1" @click="copyInvite">Copy your invitation link</button>
      <button class="btn2" @click="toDetail">Invite Details</button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import img26 from '@/assets/images/img26.png';
import { ref, onMounted, getCurrentInstance, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { inviting, getSigner } from 'starcraft-sdk';
const { proxy } = getCurrentInstance() as any;
const store = useStore();
const router = useRouter();
const route = useRoute();
const walletAccount = computed(() => store.state.walletAccount);
const parentAddress = ref('');
const inviteCode = computed(() => store.state.inviteCode);
const inviteLink = ref('');
const inputVal: any = ref('');

onMounted(() => {
  if (route.query.inviteCode) store.commit('setInviteCode', route.query.inviteCode);
  inputVal.value = inviteCode.value;
  if (walletAccount.value) {
    getUserInviter();
    inviteLink.value = window.location.origin + '/#/Invite?inviteCode=' + walletAccount.value;
  }
});
const getUserInviter = async () => {
  try {
    const res = await inviting().userInviter(walletAccount.value);
    if (res !== '0x0000000000000000000000000000000000000000') {
      parentAddress.value = res;
    }
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};

const toBind = async () => {
  if (!inputVal.value) return proxy.$showToast('Please fill out');
  if (inputVal.value == walletAccount.value) return proxy.$showToast(`Can't bind itself`);
  const user = await inviting().userInviter(inputVal.value);
  if (walletAccount.value == user) return proxy.$showToast(`Can't bind itself`);
  proxy.$showLoadingToast({});
  try {
    const tx = await inviting().connect(getSigner()).bindInviter(inputVal.value);
    await tx.wait();
    proxy.$showSuccessToast();
    getUserInviter();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};

const copyInvite = () => {
  if (inviteLink.value) proxy.$utils.handleCopy(inviteLink.value);
};
const toDetail = () => {
  router.push('/InviteDetails');
};
</script>

<style lang="scss" scoped>
.container2 {
  width: 100%;
  padding: 0 15px;
}
.banner {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}
input {
  width: 100%;
  height: 44px;
  background: #2a3042;
  box-shadow: 0 0 10px 0 rgba(77, 120, 255, 0.5);
  border-radius: 4px;
  border: 2px solid #fff;
  font-size: 14px;
  padding: 0 16px;
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
.btn2 {
  width: fit-content;
  height: 20px;
  margin: 0 auto;
  font-size: 16px;
  text-decoration: underline;
}
</style>
