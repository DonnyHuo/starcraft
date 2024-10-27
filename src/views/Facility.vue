<template>
  <section class="container">
    <HeaderTitle :headTitle="'Facility Lucky Box'" />
    <div class="container2">
      <img class="box" :src="img23" alt="" />
      <div class="tabs_content">
        <div class="tabs">
          <div :class="{ active: tab == 1 }" @click="switchTab(1)">
            Pay with SCT
            <img v-if="tab == 2" class="img1" :src="img24" alt="" />
          </div>
          <div :class="{ active: tab == 2 }">
            <!-- Use old Facility -->
            <img v-if="tab == 1" class="img2" :src="img24" alt="" />
          </div>
        </div>
        <template v-if="tab == 1">
          <button class="btn" v-if="SCTIsApprove" @click="toBuy">
            {{ boxPrice }} SCT for 1 Planet Facility Lucky BOX
          </button>
          <button class="btn" v-else @click="toApprove1">Approve SCT</button>
        </template>
        <template v-if="tab == 2">
          <button class="btn" @click="showSelectFacility = true">Select Facility</button>
          <!-- <div class="itembox" @click="showSelectFacility = true">
          <img :src="img29" alt="" />
          <div class="item">
            <img src="https://nft.starcarft.vip/starcraftimgs/Recycle Bin.png" alt="" />
            <div class="text">
              <p>Recycle Bin #45100</p>
              <p>Energy 1</p>
            </div>
          </div>
        </div> -->
          <button class="btn">Pay 100 SCT + old Facil</button>
        </template>
        <div class="des">
          You can pay 2000 SCT tokens to buy a planetary facility lucky box, open the lucky box to have a 100% chance to
          get the equipment.
          <!-- You can also buy a planetary equipment lucky box by using the old equipment + paying
          100SCT, open the lucky box and you will have a 20% chance to get a new equipment, if the new equipment cannot
          be obtained, the old equipment will be returned. -->
        </div>
      </div>
    </div>
    <!-- <van-popup v-model:show="showSelectFacility" :style="{ background: 'transparent' }">
      <div class="popupbox1">
        <img class="closebtn" :src="img32" alt="" @click="closeSelectFacility" />
        <div class="title">Select Facility</div>
        <div class="popup_SelectFacility">
          <ul>
            <li v-for="(item, index) in 10" :key="index">
              <img src="https://nft.starcarft.vip/starcraftimgs/Solar sail.png" alt="" />
              <p>Energy:40</p>
            </li>
          </ul>
        </div>
      </div>
    </van-popup> -->
    <van-popup v-model:show="showBagsItem" :style="{ background: 'transparent' }">
      <div class="popupbox1">
        <img class="closebtn" :src="img32" alt="" @click="closeBagsItem" />
        <div class="popup_BagsItem">
          <img :src="scfImage" alt="" />
          <p>{{ scfName }}</p>
          <div class="attr">
            <img :src="img37" alt="" />
            <div>
              <div class="title2">
                <span>Energy</span> <span>{{ scfAttributes.Energy }}</span>
              </div>
              <div class="progress2">
                <i v-for="(item, index) in 12" :key="index" :class="{ active: index + 1 <= scfAttributes.Energy }"></i>
              </div>
            </div>
          </div>
          <button class="btn2" @click="toBags">View in Bags</button>
        </div>
      </div>
    </van-popup>
  </section>
</template>

<script lang="ts" setup>
import img23 from '@/assets/images/img23.png';
import img24 from '@/assets/images/img24.png';
import img32 from '@/assets/images/img32.svg';
import img37 from '@/assets/images/img37.svg';

import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { scfBox, scf, util, erc20, token, contract, getSigner } from 'starcraft-sdk';
const { proxy } = getCurrentInstance() as any;
const store = useStore();
const router = useRouter();
const route = useRoute();
const walletAccount = computed(() => store.state.walletAccount);
const tab = ref(1);
const showSelectFacility = ref(false);
const showBagsItem = ref(false);
const boxPrice = ref(0);
const boxAmount = ref(0);
const SCTBalance = ref(0);
const SCTIsApprove = ref(true);
const scfName: any = ref('');
const scfImage: any = ref('');
let scfAttributes: any = reactive({});

onMounted(() => {
  getBoxPrice();
  getBoxLeftSupply();
  if (walletAccount.value) {
    getBalance();
  }
});

const getBalance = async () => {
  SCTBalance.value = await proxy.$walletUtils.getBalance(token().SCT);
  SCTIsApprove.value = await proxy.$walletUtils.checkApprove(token().SCT, contract().SCFBox, SCTBalance.value);
};

const toApprove1 = async () => {
  proxy.$showLoadingToast({});
  try {
    const tx = await erc20(token().SCT)
      .connect(getSigner())
      .approve(contract().SCFBox, util.parseUnits((1e10).toString()));
    await tx.wait();
    getBalance();
    proxy.$showSuccessToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
const toBuy = async () => {
  if (!walletAccount.value) return proxy.$showToast('Please connect wallet');
  if (boxPrice.value > SCTBalance.value) return proxy.$showToast('Insufficient balance');
  if (!boxAmount.value) return;
  proxy.$showLoadingToast({});
  try {
    const tx = await scfBox().connect(getSigner()).draw(0, 1);
    await tx.wait();
    proxy.$showSuccessToast();
    getSCFList();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
/**获取设施 */
const getSCFList = async () => {
  proxy.$showLoadingToast({});
  try {
    const res = await scf().tokensOfOwnerBySize(walletAccount.value, 0, 1000);
    const ids = res[0].map((item) => Number(item));
    const lastOne = ids[ids.length - 1];
    const res2 = await scf().tokenURI(lastOne);
    const base64Data = res2.split(',')[1];
    const decodedData = atob(base64Data);
    const jsonData = JSON.parse(decodedData);
    jsonData.attributes = jsonData.attributes.reduce((acc, attribute) => {
      acc[attribute.trait_type] = attribute.value;
      return acc;
    }, {});
    scfName.value = jsonData.name;
    scfImage.value = jsonData.image;
    scfAttributes = jsonData.attributes;
    showBagsItem.value = true;
    proxy.$closeToast();
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
// const onSpawnNFT = () => {
//   try {
//     let filter = scf().filters.SpawnNFT(walletAccount.value);
//     scf().on(filter, (user, newNFTId) => {
//     });
//   } catch (err) {
//     console.error(err);
//     proxy.$showFailToast('Error');
//   }
// };

const getBoxPrice = () => {
  scfBox()
    .boxPrice(0)
    .then((res) => {
      boxPrice.value = proxy.$utils.utilFormat(util.formatEther(res));
      // console.log('盲盒的单价', boxPrice.value);
    })
    .catch((err) => {
      console.error(err);
    });
};
const getBoxLeftSupply = () => {
  scfBox()
    .getBoxLeftSupply(0)
    .then((res) => {
      boxAmount.value = Number(res);
      // console.log('盲盒的剩余可销售数量', boxAmount.value);
    })
    .catch((err) => {
      console.error(err);
    });
};
/**获取某商品的支付token */
// const getBoxToken = () => {
//   scfBox()
//     .boxToken(0)
//     .then((res) => {
//       console.log('tokenAddr', res); // SCT
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };
const switchTab = (index) => {
  tab.value = index;
};
const closeBagsItem = () => {
  showBagsItem.value = false;
};
const toBags = () => {
  router.push('/Bags');
};
const closeSelectFacility = () => {
  showSelectFacility.value = false;
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
.itembox {
  width: fit-content;
  display: flex;
  align-items: center;
  margin: 0 auto;
  position: relative;
  .item {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 0 12px;
    > img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff;
      margin-right: 20px;
    }
    .text {
      p {
        font-size: 12px;
        &:nth-child(2) {
          color: #f3c040;
        }
      }
    }
  }
}
.popup_SelectFacility {
  width: 100%;
  height: 335px;
  ul {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    li {
      width: fit-content;
      height: fit-content;
      background: hsla(0, 0%, 100%, 0.1);
      box-shadow: inset 0 6px 16px 0 rgba(2, 7, 32, 0.5);
      border-radius: 4px;
      border: 2px solid #fff;
      margin: 4px;
      position: relative;
      float: left;
      img {
        width: 74px;
        height: 82px;
      }
      p {
        width: 100%;
        line-height: 30px;
        position: absolute;
        bottom: 0;
        left: 0;
        color: #fff;
        font-size: 12px;
        background: rgba(2, 7, 32, 0.5);
        text-align: center;
      }
    }
  }
}
</style>
