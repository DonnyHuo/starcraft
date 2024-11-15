<template>
  <section class="container">
    <HeaderTitle :headTitle="'Rich Plan'" />
    <div class="container2">
      <img class="banner" :src="img52" alt="" />
      <p class="from">From: {{ inputVal }}</p>
      <div class="tabs_content">
        <div class="tabs">
          <div class="active">
            Buy SCT
          </div>
          <div>
            <img class="img2" :src="img24" alt="" />
          </div>
        </div>
        <div class="main_contaienr">
          <div class="input_wrap">
            <input class="input" type="number" v-model="inputModel" placeholder="Please Enter" @input="getAmountOut">
            <div class="input_token">USDT</div>
          </div>
          <div class="ava_balance">
            You can get: 
            {{ proxy.$utils.formatNumber(sctVal, 4) }}
            SCT
          </div>
          <div class="tips_content">
            *Tip: The price is the actual exchange rate and the final price is subject to actual receipt.
          </div>
          <button
            class="button"
            :disabled="!inputModel ? true : false"
            :class="{ disabled: !inputModel }"
            v-if="isApproveUSDT"
            @click="toPurchase"
          >Purchase</button>
          <button
            class="button"
            :disabled="!inputModel ? true : false"
            :class="{ disabled: !inputModel }"
            v-else
            @click="toApprove"
          >Approve USDT</button>
        </div>
      </div>
    </div>
  </section>
</template>
  
<script lang="ts" setup>
import img52 from '@/assets/images/img52.png';
import img24 from '@/assets/images/img24.png';
import { ref, onMounted, getCurrentInstance, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { erc20, getSigner, rpcProvider, token, util } from '@/utils';
import { ContractConnect } from '@/constants/sdk/index';
import { richPlanInvite } from '@/constants/config';
import inviteAbi from '@/abis/inviting.json';
import _ from "lodash";

const { proxy } = getCurrentInstance() as any;
const store = useStore();
const route = useRoute();
const walletAccount = computed(() => store.state.walletAccount);
const inviteCode = computed(() => store.state.inviteCode);
const inputVal: any = ref('');
const inputModel: any = ref(null);
const sctVal: any = ref(0);
const sctValEth: any = ref(0);
const isApproveUSDT: any = ref(false);
const balanceUSDT: any = ref(null);
const isInvited: any = ref(false);

onMounted(() => {
  if (route.query.inviteCode) store.commit('setInviteCode', route.query.inviteCode);
  inputVal.value = inviteCode.value;
  if (walletAccount.value) {
    getUSDTIsApproved()
    getUserInviter()
  }
});
 
const valueChange = _.debounce(async () => {
  if (!inputModel.value) {
    sctVal.value = 0
    return
  }
  getAmountsOut()
}, 500)

const getAmountsOut = async() => { 
  try {
    const inviteContract = ContractConnect(richPlanInvite, rpcProvider, inviteAbi)
    const res = await inviteContract.getAmountsOut(
      util.parseUnits(inputModel.value.toString()),
      [
        token().USDT,
        token().SCT
      ]
    );
    sctVal.value = proxy.$utils.utilFormat(util.formatEther(res[1]))
    sctValEth.value = res[1]
    return sctValEth.value;
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
}

const getUserInviter = async () => {
  try {
    const inviteContract = ContractConnect(richPlanInvite, rpcProvider, inviteAbi)
    const res = await inviteContract.userInviter(walletAccount.value);
    if (res.inviter !== '0x0000000000000000000000000000000000000000') {
      isInvited.value = true;
    }
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};

const getAmountOut = async () => {
  if (!inputModel.value) {
    sctVal.value = 0
    return
  }
  getUSDTIsApproved()
  valueChange()
}

const getUSDTIsApproved = async () => {
  balanceUSDT.value = await proxy.$walletUtils.getBalance(token().USDT);
  const balance = inputModel.value === null ? 0 : inputModel.value
  isApproveUSDT.value = await proxy.$walletUtils.checkApprove(token().USDT, richPlanInvite, balance);
};

const toApprove = async () => {
  proxy.$showLoadingToast({});
  try {
    const tx = await erc20(token().USDT)
      .connect(getSigner())
      .approve(richPlanInvite, util.parseUnits((1e10).toString()));
    await tx.wait();
    getUSDTIsApproved();
    proxy.$showSuccessToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};

const toPurchase = async () => {
  if (!walletAccount.value) return proxy.$showToast('Please connect wallet');
  if (inputModel.value > balanceUSDT.value) return proxy.$showToast('Insufficient balance');
  if (inputVal.value === walletAccount.value) return proxy.$showToast('inviter cannot be yourself');
  if (isInvited.value) return proxy.$showToast('Already invited');
  proxy.$showLoadingToast({});
  try {
    const inviteContract = ContractConnect(richPlanInvite, rpcProvider, inviteAbi)
    console.log('from: ', inputVal.value)
    console.log('buy: ', inputModel.value.toString())
    console.log('buy format: ', util.parseUnits(inputModel.value.toString()))
    const recent_min = await getAmountsOut()
    console.log('recent_min:', recent_min)
    console.log('recent_min format:', proxy.$utils.utilFormat(util.formatEther(recent_min)))
    const tx = await inviteContract.connect(getSigner()).bindInviter(inputVal.value, util.parseUnits(inputModel.value.toString()), recent_min);
    await tx.wait();
    proxy.$showSuccessToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};

</script>
  
<style lang="scss" scoped>
.container2 {
  width: 100%;
  padding: 0 15px;
}

.banner {
  width: 7.5rem;
  height: auto;
  margin: 0 auto 1rem;
  display: flex;
}
.from {
  color: #FFF;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  margin-bottom: 1.1rem;
}
.main_contaienr {
  padding: 1.5rem 1.4rem;
}

.input_wrap {
  width: 100%;
  height: 2.8rem;
  border-radius: 0.25rem;
  border: 2px solid #FFF;
  background: rgba(46, 81, 207, 0.25);
  box-shadow: 0px 0px 30px 0px #2E59FF;
  display: flex;
  input {
    padding: 0 1.2rem;
    flex: 1;
    &::placeholder {
      color: rgba(255, 255, 255, 0.50);
    }
  }
  .input_token {
    width: 4.5rem;
    border-left: 1px solid #FFF;
    text-align: center;
    line-height: 2.8rem;
  }
}

.ava_balance {
  color: #FFF;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin: 1.5rem 0;
  text-align: center;
}
.tips_content {
  width: 100%;
  height: 4.3rem;
  background: rgba(46, 81, 207, 0.25);
  padding: 1.2rem 1.5rem;
  color: #FFF;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
}

.button {
  width: 100%;
  height: 94px;
  margin: 1rem auto 0;
  background: url('../assets/images/img25.png') no-repeat;
  background-size: 100% 100%;
  font-size: 14px;
  text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
}


</style>
  