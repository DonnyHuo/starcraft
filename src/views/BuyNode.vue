<template>
  <section class="container">
    <HeaderTitle :headTitle="'Purchase Node'" />
    <div class="container2">
      <img class="box" :src="img23" alt="" />
      <div class="tabs_content">
        <div class="tabs">
          <div :class="{ active: tab == 1 }" @click="switchTab(1)">
            Basic node
            <img v-if="tab == 2" class="img1" :src="img24" alt="" />
          </div>
          <div :class="{ active: tab == 2 }" @click="switchTab(2)">
            Super node
            <img v-if="tab == 1" class="img2" :src="img24" alt="" />
          </div>
        </div>
        <button class="btn" v-if="isApproveUSDT" @click="toBuy">
          {{ tab == 1 ? commonNode : superNode }} USDT for 1 Node
        </button>
        <button class="btn" v-else @click="toApprove">Approve USDT</button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import img23 from '@/assets/images/img23.png';
import img24 from '@/assets/images/img24.png';
import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue';
import { useStore } from 'vuex';
import { buyNode, util, erc20, token, contract, getSigner } from '@/utils';
import router from '@/router';
const { proxy } = getCurrentInstance() as any;
const store = useStore();
const walletAccount = computed(() => store.state.walletAccount);
const tab = ref(1);
const commonNode = ref(0);
const superNode = ref(0);
const balanceUSDT = ref(0);
const isApproveUSDT = ref(true);

onMounted(() => {
  if (walletAccount.value) {
    getPrice();
    getBalanceUSDT();
  }
});
/**获取某类型的节点的购买价格（传1是普通节点，传2是超级节点） */
const getPrice = async () => {
  proxy.$showLoadingToast({});
  try {
    const res = await buyNode().price(1);
    const res2 = await buyNode().price(2);
    commonNode.value = proxy.$utils.utilFormat(util.formatEther(res));
    superNode.value = proxy.$utils.utilFormat(util.formatEther(res2));
    proxy.$closeToast();
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**用户购买某类型的节点（1是普通节点，2是超级节点）；
需要用户没有购买过节点；
需要用户钱包里有足够数量的USDT；
需要先去USDT合约授权额度给本合约； */
const toBuy = async () => {
  if (!walletAccount.value) return proxy.$showToast('Please connect wallet');
  const nodePrice = tab.value === 1 ? commonNode.value : superNode.value;
  if (nodePrice > balanceUSDT.value) return proxy.$showToast('Insufficient balance');
  proxy.$showLoadingToast({});
  try {
    const tx = await buyNode().connect(getSigner()).buy(tab.value);
    await tx.wait();
    proxy.$showSuccessToast();
    setTimeout(() => {
      router.push('/NodeReward');
    }, 1000);
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
const getBalanceUSDT = async () => {
  balanceUSDT.value = await proxy.$walletUtils.getBalance(token().USDT);
  isApproveUSDT.value = await proxy.$walletUtils.checkApprove(token().USDT, contract().BuyNode, balanceUSDT.value);
};
const toApprove = async () => {
  proxy.$showLoadingToast({});
  try {
    const tx = await erc20(token().USDT)
      .connect(getSigner())
      .approve(contract().BuyNode, util.parseUnits((1e10).toString()));
    await tx.wait();
    getBalanceUSDT();
    proxy.$showSuccessToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};

const switchTab = (index) => {
  tab.value = index;
};
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
.container3 {
  padding: 0 15px;
}
.text {
  p {
    font-size: 20px;
    line-height: 40px;
    text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
    span {
      font-size: 20px;
      font-weight: bold;
      color: #eafdff;
      text-shadow: 0px 0px 4px #00e8ff;
    }
  }
}
.listbox {
  width: 100%;
  height: calc(100vh - 280px);
  background: #1c283e;
  box-shadow: inset 0 0 20px 0 rgba(77, 120, 255, 0.5);
  border-radius: 8px;
  border: 2px solid #fff;
  margin-top: 20px;
  padding: 10px;
  .th,
  ul li {
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #fff;
    font-size: 14px;
    p {
      &:nth-child(1) {
        width: 30%;
      }
      &:nth-child(2) {
        width: 40%;
        text-align: center;
      }
      &:nth-child(3) {
        width: 30%;
        text-align: right;
      }
    }
  }
  .nodata {
    text-align: center;
    font-size: 20px;
    line-height: 40px;
    text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
  }
  ul {
    width: 100%;
    height: calc(100% - 45px);
    overflow-y: auto;
    li {
      border-bottom: 1px solid #333;
      a {
        color: #fff;
      }
    }
  }
}
</style>
