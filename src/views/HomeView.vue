<template>
  <section class="container">
    <div class="box">
      <div class="btns">
        <!-- <button @click="toPage('/Fuel/2')">L3 Get Fuel</button> -->
        <!-- <button @click="toPage('/BuyRole/2')" v-if="isDrawed == 0">L3 Planet Lucky Box</button> -->
      </div>
    </div>
    <ul class="list">
      <li @click="toPage('/Mining')" v-if="isDrawed == 2">
        <img :src="img15" alt="" />
        <p>My Planet</p>
      </li>
      <li @click="toPage('/BuyRole/1')" v-if="isDrawed == 0">
        <img :src="img7" alt="" />
        <p>Planet Lucky Box</p>
      </li>
      <li @click="toPage('/TokenInfo')">
        <img :src="img13" alt="" />
        <p>SCT Token Info</p>
      </li>
      <li @click="toPage('/Facility')">
        <img :src="img4" alt="" />
        <p>Facility Lucky Box</p>
      </li>
      <li @click="toPage('/Fuel/1')">
        <img :src="img5" alt="" />
        <p>Get Fuel</p>
      </li>
      <li @click="toPage('/RichPlan')">
        <img :src="img51" alt="" />
        <p>Rich Plan</p>
      </li>
      <!-- <li @click="toPage('/Invite')">
        <img :src="img6" alt="" />
        <p>Invitation Relationship</p>
      </li> -->
      <li @click="toPage('/NodeReward')" v-if="isPurchased > 0">
        <img :src="img49" alt="" />
        <p>Node Reward</p>
      </li>
      <li @click="toPage('/BuyNode')" v-else>
        <img :src="img49" alt="" />
        <p>Purchase Node</p>
      </li>
      <li @click="toPage('/Bind')">
        <img :src="img6" alt="" />
        <p>Bind</p>
      </li>
      <li @click="toPage('/Bridge')">
        <img :src="img3" alt="" />
        <p>Bridge</p>
      </li>
    </ul>
    <img class="bag_img" :src="img27" alt="" @click="router.push('/Bags')" />
    <van-popup v-model:show="show" :style="{ width: '100%', background: 'transparent' }">
      <div class="popupbox1 rich_plan_popup">
        <img class="closebtn" :src="img32" alt="" @click="closeItem" />
        <img class="banner" :src="img26" alt="" />
        <p class="main_title">Get Rich Plan </p>
        <p class="main_desc">Invite Your Friends To Join Us Now</p>
        <div class="tips_content">When A Friend Purchases SCT, The Inviter Will Receive A One-Timreward Of 1%</div>
        <button class="btn1" @click="copyInvite">Copy invitation link</button>
      </div>
    </van-popup>
  </section>
</template>

<script lang="ts" setup>
import img32 from '@/assets/images/img32.svg';
import img26 from '@/assets/images/img26.png';
import img3 from '@/assets/images/img3.png';
import img4 from '@/assets/images/img4.png';
import img5 from '@/assets/images/img5.png';
import img6 from '@/assets/images/img6.png';
import img7 from '@/assets/images/img7.png';
import img13 from '@/assets/images/img13.png';
import img15 from '@/assets/images/img15.png';
import img27 from '@/assets/images/img27.png';
import img49 from '@/assets/images/img49.png';
import img51 from '@/assets/images/img51.png';
import { ref, onMounted, getCurrentInstance, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { scp, scpBox, planetPool, buyNode } from 'starcraft-sdk';
const router = useRouter();
const route = useRoute();
const store = useStore();
const { proxy } = getCurrentInstance() as any;
const walletAccount = computed(() => store.state.walletAccount);
const isDrawed = ref(0);
const isPurchased = ref(0);
const show = computed(() => store.state.isShowRichPlanDialog);
const inviteLink = ref('');

onMounted(() => {
  if (walletAccount.value) {
    getIsPurchased();
    inviteLink.value = window.location.origin + '/#/RichPlanInvite?inviteCode=' + walletAccount.value;
  }
});
const copyInvite = () => {
  if (inviteLink.value) proxy.$utils.handleCopy(inviteLink.value);
  store.commit('setIsShowRichPlanDialog', false)
};
const closeItem = () => {
  store.commit('setIsShowRichPlanDialog', false)
};

/**获取某用户是否已抽盲盒 */
const getIsDrawed = async () => {
  proxy.$showLoadingToast({});
  try {
    const res = await planetPool().userSCPId(walletAccount.value);
    if (Number(res) > 0) {
      isDrawed.value = 2;
      proxy.$closeToast();
    } else {
      const tokens = await scp().tokensOfOwnerBySize(walletAccount.value, 0, 1000);
      if (tokens[0].length > 0) {
        isDrawed.value = 2;
        proxy.$closeToast();
      } else {
        const res = await scpBox().isDrawed(walletAccount.value);
        isDrawed.value = res ? 1 : 0; // 0没抽过 1抽过 2已有星球
        proxy.$closeToast();
      }
    }
    // console.log('获取某用户是否已抽盲盒', isDrawed.value);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取某用户已购买的节点类型（0是没有购买节点，1是普通节点，2是超级节点） */
const getIsPurchased = async () => {
  proxy.$showLoadingToast({});
  try {
    const res = await buyNode().isPurchased(walletAccount.value);
    isPurchased.value = Number(res);
    proxy.$closeToast();
    getIsDrawed();
    // console.log('获取某用户已购买的节点类型（0是没有购买节点，1是普通节点，2是超级节点）', Number(res));
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
const toPage = (path: string) => {
  if (!path) return proxy.$showToast('coming soon');
  router.push(path);
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: calc(100vh - 90px);
  position: relative;
  padding: 0 15px;
}

.box {
  .title {
    font-size: 20px;
    text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
  }

  .btns {
    display: flex;

    button {
      width: 50%;
      height: 94px;
      background: url('../assets/images/img25.png') no-repeat;
      background-size: 100% 100%;
      font-size: 14px;
      text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
    }
  }
}

.list {
  padding: 60px 0 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  li {
    width: 33.33%;
    height: auto;
    position: relative;
    margin-bottom: 30px;

    &:nth-of-type(3n-1),
    &.li_top {
      transform: translateY(-50px);
    }

    &:nth-of-type(7) {
      transform: translate(0px, -50px);
    }

    &:nth-of-type(8) {
      transform: translate(25px, -50px);
    }


    img {
      width: 100%;
      height: auto;
    }

    p {
      width: 90%;
      text-align: center;
      position: absolute;
      top: 65%;
      left: 0;
      right: 0;
      margin: auto;
      font-size: 16px;
      color: #fff;
    }
  }
}

.bag_img {
  width: 64px;
  height: auto;
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.banner {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.main_title {
  color: #FFF;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.main_desc {
  color: #FFF;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: capitalize;
  margin-top: 0.6rem;
  margin-bottom: 1rem;
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

.tips_content {
  width: 100%;
  height: 4.3rem;
  background: rgba(46, 81, 207, 0.25);
  padding: 0.8rem 1.5rem;
  color: #FFF;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  margin-bottom: 1.8rem;
  margin-top: 1.8rem;
}

.rich_plan_popup {
  width: 100%;
  padding: 5rem 1rem;

  .closebtn {
    width: 2rem;
    height: 2rem;
    position: absolute;
    left: 1rem;
    top: 2.5rem;
  }
}
</style>
