<template>
  <section class="container">
    <HeaderTitle :headTitle="'Planet Lucky Box'" />
    <div class="container2">
      <img class="box" :src="img28" alt="" />
      <div class="tabs_content">
        <div class="tabs">
          <div :class="{ active: tab == 1 }" @click="switchTab(1)">
            Advanced Planet
            <img v-if="tab == 2" class="img1" :src="img24" alt="" />
          </div>
          <div>
            <img v-if="tab == 1" class="img2" :src="img24" alt="" />
          </div>
          <!-- <div :class="{ active: tab == 2 }" @click="switchTab(2)">
            Primary Planet
            <img v-if="tab == 1" class="img2" :src="img24" alt="" />
          </div> -->
        </div>
        <template v-if="tab == 1">
          <button class="btn" v-if="SCTIsApprove" @click="toBuy">{{ boxPrice }} SCT for 1 Planet Lucky BOX</button>
          <button class="btn" v-else @click="toApprove">Approve SCT</button>
          <div class="des">
            In the first 5000 lucky boxes,you have chance toget the high-level planet. After 5000 lucky boxes,you can get a 1st-level planet in a
            lucky box. <br /><br />
            You only can have one planet for one address.
          </div>
        </template>
        <template v-if="tab == 2">
          <button class="btn" v-if="L3IsApprove" @click="toBuy2">{{ boxPrice2 }} L3 for 1 Planet Lucky BOX</button>
          <button class="btn" v-else @click="toApproveL3">Approve L3</button>
          <div class="des">
            In the first 20000 lucky boxes,you have chance toget the level-2 planet.<br /><br />
            You only can have one planet for one address.
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import img28 from '@/assets/images/img28.png';
import img24 from '@/assets/images/img24.png';

import { ref, onMounted, getCurrentInstance, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { scpBox, util, erc20, token, contract, getSigner, planetPool, scp } from '@/utils';
const { proxy } = getCurrentInstance() as any;
const store = useStore();
const router = useRouter();
const route = useRoute();
const walletAccount = computed(() => store.state.walletAccount);
const isDrawed = ref(0);
const tab = ref(1);
const boxAmount = ref(0);
const boxAmount2 = ref(0);
const boxPrice = ref(0);
const boxPrice2 = ref(0);
const SCTBalance = ref(0);
const SCTIsApprove = ref(true);
const L3Balance = ref(0);
const L3IsApprove = ref(true);

onMounted(() => {
  getBoxPrice();
  getBoxLeftSupply();
  switchTab(route.params.type);
  if (walletAccount.value) {
    getIsDrawed();
    getBalance();
    getBalanceL3();
  }
});
const switchTab = (index) => {
  tab.value = index;
};
/**获取某用户是否已抽盲盒 */
const getIsDrawed = async () => {
  proxy.$showLoadingToast({});
  try {
    const res = await planetPool().userSCPId(walletAccount.value);
    if (Number(res) > 0) {
      isDrawed.value = 2;
    } else {
      const tokens = await scp().tokensOfOwnerBySize(walletAccount.value, 0, 1000);
      if (tokens[0].length > 0) {
        isDrawed.value = 2;
      } else {
        const res = await scpBox().isDrawed(walletAccount.value);
        isDrawed.value = res ? 1 : 0; // 0没抽过 1抽过 2已有星球
      }
    }
    // console.log('获取某用户是否已抽盲盒', isDrawed.value);
    proxy.$closeToast();
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};

const getBalance = async () => {
  SCTBalance.value = await proxy.$walletUtils.getBalance(token().SCT);
  SCTIsApprove.value = await proxy.$walletUtils.checkApprove(token().SCT, contract().SCPBox, SCTBalance.value);
};
const getBalanceL3 = async () => {
  L3Balance.value = await proxy.$walletUtils.getBalance(token().L3);
  L3IsApprove.value = await proxy.$walletUtils.checkApprove(token().L3, contract().SCPBox, L3Balance.value);
};
const toApprove = async () => {
  proxy.$showLoadingToast({});
  try {
    const tx = await erc20(token().SCT).connect(getSigner()).approve(contract().SCPBox, util.parseUnits((1e10).toString()));
    await tx.wait();
    getBalance();
    proxy.$showSuccessToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
const toApproveL3 = async () => {
  proxy.$showLoadingToast({});
  try {
    const tx = await erc20(token().L3).connect(getSigner()).approve(contract().SCPBox, util.parseUnits((1e10).toString()));
    await tx.wait();
    getBalanceL3();
    proxy.$showSuccessToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
const getBoxPrice = () => {
  scpBox()
    .boxPrice(0)
    .then((res) => {
      boxPrice.value = proxy.$utils.utilFormat(util.formatEther(res));
      // console.log('盲盒的单价', boxPrice.value);
    })
    .catch((err) => {
      console.error(err);
      proxy.$showFailToast('Error');
    });
  scpBox()
    .boxPrice(1)
    .then((res) => {
      boxPrice2.value = proxy.$utils.utilFormat(util.formatEther(res));
      // console.log('盲盒的单价', boxPrice2.value);
    })
    .catch((err) => {
      console.error(err);
      proxy.$showFailToast('Error');
    });
};
const getBoxLeftSupply = () => {
  scpBox()
    .getBoxLeftSupply(0)
    .then((res) => {
      boxAmount.value = Number(res);
      // console.log('盲盒的剩余可销售数量', boxAmount.value);
    })
    .catch((err) => {
      console.error(err);
    });
  scpBox()
    .getBoxLeftSupply(1)
    .then((res) => {
      boxAmount2.value = Number(res);
      // console.log('盲盒的剩余可销售数量', boxAmount2.value);
    })
    .catch((err) => {
      console.error(err);
    });
};
const toBuy = async () => {
  if (!walletAccount.value) return proxy.$showToast('Please connect wallet');
  if (boxPrice.value > SCTBalance.value) return proxy.$showToast('Insufficient balance');
  if (!boxAmount.value) return;
  if (isDrawed.value > 0) return;
  proxy.$showLoadingToast({});
  try {
    const tx = await scpBox().connect(getSigner()).draw(0);
    await tx.wait();
    proxy.$showSuccessToast();
    setTimeout(() => {
      router.push('/Mining');
    }, 1000);
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
const toBuy2 = async () => {
  if (!walletAccount.value) return proxy.$showToast('Please connect wallet');
  if (boxPrice2.value > L3Balance.value) return proxy.$showToast('Insufficient balance');
  if (!boxAmount2.value) return;
  if (isDrawed.value > 0) return;
  proxy.$showLoadingToast({});
  try {
    const tx = await scpBox().connect(getSigner()).draw(1);
    await tx.wait();
    proxy.$showSuccessToast();
    setTimeout(() => {
      router.push('/Mining');
    }, 1000);
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
// const getBoxToken = () => {
//   scpBox()
//     .boxToken(0)
//     .then((res) => {
//       currentBoxToken.value = res; // SCT
//       console.log('支付代币地址', currentBoxToken.value);
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };
</script>

<style lang="scss" scoped>
.container2 {
  width: 100%;
}
.box {
  width: 240px;
  height: 240px;
  display: block;
  margin: 16px auto;
}
</style>
