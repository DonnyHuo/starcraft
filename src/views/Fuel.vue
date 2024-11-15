<template>
  <section class="container">
    <HeaderTitle :headTitle="'Get Fuel'" />
    <div class="container2">
      <div class="fuelbox">
        <div class="burners" v-if="tab == 1">
          <div class="pic">
            <img :src="img19" alt="" />
          </div>
          <div class="info">
            <p>Burners</p>
            <p>Fuel description: It is used for daily pledge mining consumption, which can be purchased with SCT</p>
            <p>Price: {{ BurnersPrice }} SCT</p>
          </div>
        </div>
        <div class="burners" v-if="tab == 2">
          <div class="pic">
            <img :src="img18" alt="" />
          </div>
          <div class="info">
            <p>Advanced Burners</p>
            <p>Fuel description: Advanced Boosters restore equipment durability and can be purchased with FILWT</p>
            <p>Price: {{ AdBurnersPrice }} FILWT</p>
          </div>
        </div>
      </div>
      <div class="tabs_content">
        <div class="tabs">
          <div :class="{ active: tab == 1 }" @click="switchTab(1)">
            Burners
            <img v-if="tab == 2" class="img1" :src="img24" alt="" />
          </div>
          <div :class="{ active: tab == 2 }" @click="switchTab(2)">
            Advanced Burners
            <img v-if="tab == 1" class="img2" :src="img24" alt="" />
          </div>
        </div>
        <template v-if="tab == 1">
          <div class="custom_stepper">
            <button class="minus" @click="handleMinus" :class="{ disabled: inputVal <= 1 }">
              <img :src="img21" alt="" />
            </button>
            <van-field v-model.number="inputVal" type="digit" @input="handleInput" />
            <button class="plus" @click="handlePlus">
              <img :src="img22" alt="" />
            </button>
          </div>
          <p class="text">Total price: {{ BurnersPriceAll }} SCT</p>
          <button class="btn" v-if="SCTIsApprove" @click="toBuy1">Purchase with SCT</button>
          <button class="btn" v-else @click="toApprove1">Approve SCT</button>
        </template>
        <template v-else>
          <div class="custom_stepper">
            <button class="minus" @click="handleMinus" :class="{ disabled: inputVal <= 1 }">
              <img :src="img21" alt="" />
            </button>
            <van-field v-model.number="inputVal" type="digit" @input="handleInput" />
            <button class="plus" @click="handlePlus">
              <img :src="img22" alt="" />
            </button>
          </div>
          <p class="text">Total price: {{ AdBurnersPriceAll }} FILWT</p>
          <button class="btn" v-if="FILWTIsApprove" @click="toBuy2">Purchase with FILWT</button>
          <button class="btn" v-else @click="toApprove2">Approve FILWT</button>
          <!-- <button class="btn" v-if="L3IsApprove" @click="toBuy3">Purchase with L3</button>
          <button class="btn" v-else @click="toApprove3">Approve L3</button> -->
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import img24 from '@/assets/images/img24.png';
import img18 from '@/assets/images/img18.png';
import img19 from '@/assets/images/img19.png';
import img21 from '@/assets/images/img21.png';
import img22 from '@/assets/images/img22.png';

import { ref, onMounted, getCurrentInstance, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { shop, erc20, util, token, contract, getSigner, shop2 } from '@/utils';
import { FILWT } from '@/constants/config';
import { useRoute, useRouter } from 'vue-router';
const { proxy } = getCurrentInstance() as any;
const store = useStore();
const router = useRouter();
const route = useRoute();
const walletAccount = computed(() => store.state.walletAccount);
const tab: any = ref(1);
const inputVal = ref(1);
const BurnersPrice = ref(0);
const BurnersPriceAll = ref(0);
const SCTBalance = ref(0);
const SCTIsApprove = ref(true);
const AdBurnersPrice = ref(0);
const AdBurnersPriceAll = ref(0);
const FILWBalance = ref(0);
const FILWTBalance = ref(0);
const FILWIsApprove = ref(true);
const FILWTIsApprove = ref(true);
const L3Balance = ref(0);
const L3IsApprove = ref(true);

watch(
  [inputVal, BurnersPrice, AdBurnersPrice],
  ([newVal, newVal2, newVal3]) => {
    BurnersPriceAll.value = newVal * newVal2;
    AdBurnersPriceAll.value = newVal * newVal3;
  },
  { immediate: true }
);

onMounted(() => {
  getGoodsPrice();
  switchTab(route.params.type);
  if (walletAccount.value) {
    getBalanceSCT();
    getBalanceFILW();
    getBalanceFILWT();
    // getBalanceL3();
  }
});
const switchTab = (index) => {
  tab.value = index;
  inputVal.value = 1;
};
const getGoodsPrice = () => {
  shop()
    .goodsPrice(token().FUEL)
    .then((res) => {
      BurnersPrice.value = proxy.$utils.utilFormat(util.formatEther(res));
      // console.log('FUEL==SCT 单价', BurnersPrice.value);
    })
    .catch((err) => {
      console.error(err);
    });
  shop()
    .goodsPrice(token().ADFUEL)
    .then((res) => {
      AdBurnersPrice.value = proxy.$utils.utilFormat(util.formatEther(res));
      // console.log('ADFUEL==FILW 单价', AdBurnersPrice.value);
    })
    .catch((err) => {
      console.error(err);
    });
};
const getBalanceSCT = async () => {
  SCTBalance.value = await proxy.$walletUtils.getBalance(token().SCT);
  SCTIsApprove.value = await proxy.$walletUtils.checkApprove(token().SCT, contract().Shop, SCTBalance.value);
};
const getBalanceFILW = async () => {
  FILWBalance.value = await proxy.$walletUtils.getBalance(token().FILW);
  FILWIsApprove.value = await proxy.$walletUtils.checkApprove(token().FILW, contract().Shop, FILWBalance.value);
};
const getBalanceFILWT = async () => {
  console.log(FILWT, 'FILWT FILWT')
  FILWTBalance.value = await proxy.$walletUtils.getBalance(FILWT);
  FILWTIsApprove.value = await proxy.$walletUtils.checkApprove(FILWT, contract().Shop, FILWTBalance.value);
};
const getBalanceL3 = async () => {
  L3Balance.value = await proxy.$walletUtils.getBalance(token().L3);
  L3IsApprove.value = await proxy.$walletUtils.checkApprove(token().L3, contract().Shop2, L3Balance.value);
};

const toApprove1 = async () => {
  proxy.$showLoadingToast({});
  try {
    const tx = await erc20(token().SCT)
      .connect(getSigner())
      .approve(contract().Shop, util.parseUnits((1e10).toString()));
    await tx.wait();
    getBalanceSCT();
    proxy.$showSuccessToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
const toApprove2 = async () => {
  proxy.$showLoadingToast({});
  try {
    const tx = await erc20(FILWT)
      .connect(getSigner())
      .approve(contract().Shop, util.parseUnits((1e10).toString()));
    await tx.wait();
    getBalanceFILWT();
    proxy.$showSuccessToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
const toApprove3 = async () => {
  proxy.$showLoadingToast({});
  try {
    const tx = await erc20(token().L3)
      .connect(getSigner())
      .approve(contract().Shop2, util.parseUnits((1e10).toString()));
    await tx.wait();
    getBalanceL3();
    proxy.$showSuccessToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};

const toBuy1 = async () => {
  if (!walletAccount.value) return proxy.$showToast('Please connect wallet');
  if (!inputVal.value) return proxy.$showToast('Please fill out');
  if (BurnersPriceAll.value > SCTBalance.value) return proxy.$showToast('Insufficient balance');
  proxy.$showLoadingToast({});
  try {
    const tx = await shop().connect(getSigner()).buy(token().FUEL, util.parseUnits(inputVal.value.toString()));
    await tx.wait();
    proxy.$showSuccessToast();
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
const toBuy2 = async () => {
  if (!walletAccount.value) return proxy.$showToast('Please connect wallet');
  if (!inputVal.value) return proxy.$showToast('Please fill out');
  if (AdBurnersPriceAll.value > FILWTBalance.value) return proxy.$showToast('Insufficient balance');
  proxy.$showLoadingToast({});
  try {
    const tx = await shop().connect(getSigner()).buy(token().ADFUEL, util.parseUnits(inputVal.value.toString()));
    await tx.wait();
    proxy.$showSuccessToast();
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
const toBuy3 = async () => {
  if (!walletAccount.value) return proxy.$showToast('Please connect wallet');
  if (!inputVal.value) return proxy.$showToast('Please fill out');
  if (AdBurnersPriceAll.value > L3Balance.value) return proxy.$showToast('Insufficient balance');
  proxy.$showLoadingToast({});
  try {
    const tx = await shop2().connect(getSigner()).buy(token().ADFUEL, util.parseUnits(inputVal.value.toString()));
    await tx.wait();
    proxy.$showSuccessToast();
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};

/**获取某商品的支付token */
// const getGoodsToken = () => {
//   const tokenAddr = tab.value === 1 ? token().FUEL : token().ADFUEL;
//   shop()
//     .goodsToken(tokenAddr)
//     .then((res) => {
//       console.log('tokenAddr', res);
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };
const handleMinus = () => {
  if (inputVal.value > 1) {
    inputVal.value -= 1;
  }
};
const handlePlus = () => {
  inputVal.value += 1;
};
const handleInput = (event) => {
  const value = parseInt(event.target.value, 10);
  if (!isNaN(value) && value >= 0) {
    inputVal.value = value;
  }
};
</script>

<style lang="scss" scoped>
.container2 {
  width: 100%;
}
.fuelbox {
  padding: 15px;
  .burners {
    width: 100%;
    background: linear-gradient(270deg, rgba(42, 48, 66, 0.1), rgba(77, 137, 235, 0.3));
    border-radius: 8px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pic {
    min-width: 120px;
    height: 120px;
    background: hsla(0, 0%, 100%, 0.1);
    box-shadow: inset 0 6px 16px 0 rgba(2, 7, 32, 0.5);
    border-radius: 4px;
    border: 2px solid #fff;
    padding: 4px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    padding-left: 5px;
    p {
      &:nth-child(1) {
        font-size: 14px;
        text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
      }
      &:nth-child(2) {
        font-size: 12px;
        color: hsla(0, 0%, 100%, 0.8);
        margin: 5px 0;
      }
      &:nth-child(3) {
        font-size: 12px;
        text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
      }
    }
  }
}
.custom_stepper {
  width: 350px;
  height: 55px;
  position: relative;
  margin: 30px auto;
  background: #3c4564;
  box-shadow: inset 0 0 10px 0 rgba(77, 120, 255, 0.5);
  border-radius: 28px;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  .minus,
  .plus {
    &.disabled {
      opacity: 0.2;
    }
  }
}
</style>
