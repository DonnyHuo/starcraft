<template>
  <van-config-provider>
    <header>
      <img class="logo" :src="logo" alt="" @click="closePage" />
      <div style="display: flex;">
        <button style="margin: 0 8px;" @click="handleSwitchToTon">Switch To Ton</button>
        <img class="menu_btn" :src="img40" alt="" v-if="walletAccount" @click="openSide" />
        <button v-else class="connect" @click="walletConnect">Connect Wallet</button>
      </div>

    </header>
    <main :class="{ miningbg: route.path == '/Mining' }">
      <router-view></router-view>
    </main>
    <van-popup v-model:show="isShowSide" closeable round position="right" :style="{ width: '280px', height: '100%' }">
      <div class="side">
        <div class="account">
          <div class="address">
            <h3>Your Address</h3>
            <div @click="proxy.$utils.handleCopy(walletAccount)">
              <button>{{ proxy.$utils.ellipsisWallet(walletAccount) }}</button>
              <img :src="img35" alt="" />
            </div>
          </div>
          <div class="balance">
            <h3>Token in Wallet</h3>
            <p><img :src="SCT" alt="" /> SCT: {{ proxy.$utils.formatNumber(balanceSCT) }}</p>
            <p><img :src="USDT" alt="" />USDT: {{ proxy.$utils.formatNumber(balanceUSDT) }}</p>
            <p><img :src="FILW" alt="" />FILW: {{ proxy.$utils.formatNumber(balanceFILW) }}</p>
            <p><img :src="FUEL" alt="" />FUEL: {{ proxy.$utils.formatNumber(balanceFUEL) }}</p>
            <p><img :src="ADFUEL" alt="" />AD FUEL: {{ proxy.$utils.formatNumber(balanceADFUEL) }}</p>
            <p><img :src="L3" alt="" />L3: {{ proxy.$utils.formatNumber(balanceL3) }}</p>
          </div>
          <div>
            <button class="btn" @click="copyInvite">Copy your invitation link</button>
          </div>
          <div class="address" v-if="parentAddress">
            <h3>Parent Address</h3>
            <div @click="proxy.$utils.handleCopy(parentAddress)">
              <button>{{ proxy.$utils.ellipsisWallet(parentAddress) }}</button>
              <img :src="img35" alt="" />
            </div>
          </div>
          <div class="ipfslist">
            <h3>IPFS</h3>
            <div v-for="(item, ind) in ipfsVersionList" :key="ind">
              V{{ item.version }} {{ currentVersion == item.version ? '(current)' : '' }}
              <p>
                <a :href="'https://ipfs.io/ipfs/' + item.cid">ipfs://{{ proxy.$utils.ellipsisWallet(item.cid) }}</a>
                <img :src="img35" alt="" @click="proxy.$utils.handleCopy('ipfs://' + item.cid)" />
              </p>
            </div>
          </div>
        </div>
        <ul>
          <li>
            <a href="https://t.me/+hokhfshdGMliYzY1" target="_blank" rel="noopener noreferrer">
              <img :src="img43" alt="" />
              <p>Join Telegram</p>
            </a>
          </li>
          <li>
            <a href="https://starcraft.cloud/#/" target="_blank" rel="noopener noreferrer">
              <img :src="img44" alt="" />
              <p>Official website</p>
            </a>
          </li>
        </ul>
      </div>
    </van-popup>
  </van-config-provider>
</template>

<script setup lang="ts">
import logo from '@/assets/images/logo.png';
import img40 from '@/assets/images/img40.svg';
import img35 from '@/assets/images/img35.svg';
import img43 from '@/assets/images/img43.svg';
import img44 from '@/assets/images/img44.svg';
import SCT from '@/assets/images/SCT.svg';
import USDT from '@/assets/images/USDT.webp';
import FILW from '@/assets/images/FILW.jpg';
import L3 from '@/assets/images/L3.webp';
import FUEL from '@/assets/images/img19.png';
import ADFUEL from '@/assets/images/img18.png';

import { onMounted, getCurrentInstance, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { inviting, token } from '@/utils';
const { proxy } = getCurrentInstance() as any;
const store = useStore();
const router = useRouter();
const route = useRoute();

const isShowSide = ref(false);
const walletAccount = computed(() => store.state.walletAccount);
const parentAddress = ref('');
const inviteLink = ref('');
const balanceSCT = ref(0);
const balanceUSDT = ref(0);
const balanceFILW = ref(0);
const balanceFUEL = ref(0);
const balanceADFUEL = ref(0);
const balanceL3 = ref(0);
const ipfsVersionList: any = ref([]);
const currentVersion = ref('');
// const balanceSCT = computed(() => store.state.balanceSCT);

onMounted(() => {
  setTimeout(async () => {
    if (walletAccount.value) {
      await proxy.$walletUtils.walletConnect();
      getBalanceSCT();
      getBalanceUSDT();
      getBalanceFILW();
      getBalanceFUEL();
      getBalanceADFUEL();
      getBalanceL3();
      getUserInviter();
      getIpfsVersion();
      inviteLink.value = window.location.origin + '/#/Invite?inviteCode=' + walletAccount.value;
    }
  }, 300);
});

// const getBalance = () => {
//   store.dispatch('getBalance', { SCT: token().SCT });
// };
const getBalanceSCT = async () => {
  balanceSCT.value = await proxy.$walletUtils.getBalance(token().SCT);
};
const getBalanceUSDT = async () => {
  balanceUSDT.value = await proxy.$walletUtils.getBalance(token().USDT);
};
const getBalanceFILW = async () => {
  balanceFILW.value = await proxy.$walletUtils.getBalance(token().FILW);
};
const getBalanceFUEL = async () => {
  balanceFUEL.value = await proxy.$walletUtils.getBalance(token().FUEL);
};
const getBalanceADFUEL = async () => {
  balanceADFUEL.value = await proxy.$walletUtils.getBalance(token().ADFUEL);
};
const getBalanceL3 = async () => {
  balanceL3.value = await proxy.$walletUtils.getBalance(token().L3);
};

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
const walletConnect = () => {
  proxy.$walletUtils.walletConnect();
};
const copyInvite = () => {
  if (inviteLink.value) proxy.$utils.handleCopy(inviteLink.value);
};
const closePage = () => {
  router.push('/');
};
const openSide = () => {
  isShowSide.value = true;
};

const getIpfsVersion = async () => {
  return
  currentVersion.value = process.env.npm_package_version || '';
  try {
    const res = await proxy.$api.getIpfsVersion();
    ipfsVersionList.value = res.slice(0, 3);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};

const handleSwitchToTon = () => {
  location.href = "https://www.starcraft-ton.xyz/#/"
}
</script>

<style lang="scss">
header {
  max-width: 750px;
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 999;
  background: rgba(42, 48, 66, 0.3);
  box-shadow: inset 0 0 18px 0 rgba(77, 120, 255, 0.5);
  border: 2px solid rgba(122, 178, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    width: auto;
    height: 100%;
  }

  .connect {
    width: 160px;
    height: 60px;
    background: url('./assets/images/img1.png');
    background-size: 100%;
    background-position: center;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #fff;
  }

  .menu_btn {
    width: 34px;
    height: 34px;
    margin-right: 16px;
  }
}

main {
  width: 100%;
  min-height: 100vh;
  background: url('./assets/images/img14.png');
  background-size: 100%;
  padding: 60px 0 30px;
}

.miningbg {
  background: url('./assets/images/img17.png');
  background-size: 100%;
}

.side {
  width: 100%;
  height: 100%;
  padding: 60px 0 20px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;

  .account {
    width: 100%;
    height: calc(100% - 85px);
    overflow-y: auto;
    padding: 0 30px;

    >div {
      margin-bottom: 10px;
    }

    h3 {
      font-size: 18px;
      font-family: Aemstel-Regular, Aemstel;
      font-weight: 400;
      color: #384c66;
      margin-bottom: 10px;
    }

    .address {
      >div {
        display: flex;
        align-items: center;
        justify-content: space-between;

        button {
          width: 80%;
          height: 45px;
          font-size: 16px;
          font-family: Aemstel-Regular, Aemstel;
          font-weight: 400;
          color: #5a7291;
          background: rgba(46, 46, 46, 0.1);
          border-radius: 8px;
        }

        img {
          width: 24px;
          height: 24px;
        }
      }
    }

    .balance {
      p {
        height: 20px;
        font-size: 16px;
        font-family: Aemstel-Regular, Aemstel;
        font-weight: 400;
        color: #5a7291;
        margin-bottom: 10px;
        display: flex;
        align-items: center;

        img {
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }
      }
    }

    .btn {
      width: 100%;
      height: 45px;
      background: #384c66;
      border-radius: 2px;
      font-size: 14px;
      font-family: Aemstel-Regular, Aemstel;
      font-weight: 400;
      color: #fff;
    }

    .ipfslist {
      font-size: 16px;
      font-family: Aemstel-Regular, Aemstel;
      font-weight: 400;
      color: #5a7291;

      p {
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }
    }
  }

  ul {
    width: 100%;
    padding: 0 30px;

    li {
      margin-top: 10px;

      img {
        width: 32px;
        margin-right: 5px;
      }
    }
  }
}

a {
  font-size: 16px;
  font-family: Aemstel-Regular, Aemstel;
  font-weight: 400;
  color: #5a7291;
  display: flex;
  align-items: center;
}

.van-popup__close-icon {
  font-size: 30px !important;
  color: #384c66 !important;
}
</style>
