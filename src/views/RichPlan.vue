<template>
  <section class="container">
    <HeaderTitle :headTitle="'user acquisition'" />
    <div class="container2">
      <img class="banner" :src="img26" alt="" />
      <p class="main_title">Congratulations</p>
      <p class="main_desc">On Becoming A Member Of The New <br> Recruitment Program, Invite Your Friends To <br> Buy SCT
        Immediately And Enjoy The 1% Reward</p>
      <button class="btn1" @click="copyInvite">Copy your invitation link</button>
      <div class="data_container">
        <div class="data-item">
          <div class="data-data">
            <van-skeleton title titleWidth="100%" :style="{ height: '1.1rem' }" v-if="totalVal === null" />
            <div class="data-num" v-else>
              <p>{{ proxy.$utils.formatNumber(totalVal, 4) }}</p> SCT
            </div>
          </div>
          <div class="data-title">Total Revenue</div>
        </div>
        <div class="data-line"></div>
        <div class="data-item">
          <div class="data-data">
            <van-skeleton title titleWidth="100%" :style="{ height: '1.1rem' }" v-if="rewardWithdrawed === null" />
            <div class="data-num" v-else>
              <p>{{ proxy.$utils.formatNumber(rewardWithdrawed, 4) }}</p> SCT
            </div>
          </div>
          <div class="data-title">Extracted</div>
        </div>
        <div class="data-line"></div>
        <div class="data-item">
          <div class="data-data">
            <van-skeleton title titleWidth="100%" :style="{ height: '1.1rem' }" v-if="rewardWaitWithdraw === null" />
            <div class="data-num" v-else>
              <p>{{ proxy.$utils.formatNumber(rewardWaitWithdraw, 4) }}</p> SCT
            </div>
          </div>
          <div class="data-title">Extractable</div>
        </div>
      </div>
      <button class="btn1" @click="toExtract" :disabled="rewardWaitWithdraw < 1 ? true : false"
        :class="{ disabled: rewardWaitWithdraw < 1 }">Extract Now</button>

      <div class="record_contaienr">
        <p class="main_title">Invitation Record</p>
        <div class="record_list" v-for="(item, ind) in recordList.list" :key="ind">
          <div class="record_item">
            <div class="item">
              <div class="item_title">income</div>
              <div class="item_data">{{ proxy.$utils.formatNumber(item.income, 4) }} SCT</div>
            </div>
            <div class="item">
              <div class="item_title">Purchase quantity</div>
              <div class="item_data">{{ proxy.$utils.formatNumber(item.purchaseQuantity, 4) }} SCT</div>
            </div>
            <div class="item">
              <div class="item_title">Time</div>
              <div class="item_data">{{ item.time }}</div>
            </div>
            <div class="item">
              <div class="item_title">Address</div>
              <div class="item_data">{{ item.invitee }}</div>
            </div>
          </div>
        </div>
      </div>

      <van-pagination v-show="list.list.length > 10" v-model="currentPage" force-ellipses :total-items="list.list.length" :show-page-size="10" @change="pageChange">
        <template #prev-text>
          <van-icon name="arrow-left" />
        </template>
        <template #next-text>
          <van-icon name="arrow" />
        </template>
        <template #page="{ text }">{{ text }}</template>
      </van-pagination>

    </div>
  </section>
</template>
  
<script lang="ts" setup>
import img26 from '@/assets/images/img26.png';
import { ref, onMounted, getCurrentInstance, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getSigner, rpcProvider, token, util } from '@/utils';
import { ContractConnect } from '@/constants/sdk/index';
import { richPlanInvite } from '@/constants/config';
import inviteAbi from '@/abis/inviting.json';
const { proxy } = getCurrentInstance() as any;
const store = useStore();
const router = useRouter();
const route = useRoute();
const walletAccount = computed(() => store.state.walletAccount);
const parentAddress = ref('');
const inviteCode = computed(() => store.state.inviteCode);
const inviteLink = ref('');
const inputVal: any = ref('');
const rewardWithdrawed: any = ref(null);
const rewardWaitWithdraw: any = ref(null);
const totalVal: any = ref(null);
const currentPage: any = ref(0);
const recordList: any = reactive({ list: [] });
const list: any = reactive({ list: [] });
// use test
// [
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "1111111",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "1111111",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "222222",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "2222222",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//     {
//       income: "99",
//       purchaseQuantity: "99",
//       time: "99",
//       invitee: "99"
//     },
//   ]

onMounted(() => {
  if (route.query.inviteCode) store.commit('setInviteCode', route.query.inviteCode);
  inputVal.value = inviteCode.value;
  if (walletAccount.value) {
    getUserInviter();
    getRecordList()
    inviteLink.value = window.location.origin + '/#/RichPlanInvite?inviteCode=' + walletAccount.value;
    console.log(token().SCT)
  }
});
const getUserInviter = async () => {
  try {
    const inviteContract = ContractConnect(richPlanInvite, rpcProvider, inviteAbi)
    const res = await inviteContract.inviteList(walletAccount.value);//
    rewardWithdrawed.value = res ? proxy.$utils.utilFormat(util.formatEther(res.rewardWithdrawed)) : 0
    rewardWaitWithdraw.value = res ? proxy.$utils.utilFormat(util.formatEther(res.rewardWaitWithdraw)) : 0
    totalVal.value = res ? (rewardWithdrawed.value + rewardWaitWithdraw.value) : 0
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
const group = (array: any, subGroupLength: any) => {
  var index = 0;
  var newArray: any = [];

  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }

  return newArray;
}

const getRecordList = async () => {
  try {
    const inviteContract = ContractConnect(richPlanInvite, rpcProvider, inviteAbi)
    const res = await inviteContract.getUserInviteeList(walletAccount.value);//walletAccount.value
    res.map((item: any) => {
      const income = proxy.$utils.utilFormat(util.formatEther(item.sctAmount))
      const purchaseQuantity = income * 100
      const time = proxy.$utils.formatDate(item.time * 1000)
      console.log(income, purchaseQuantity, time)
      list.list.push({
        invitee: item.invitee,
        income,
        purchaseQuantity,
        time
      })
    })
    console.log(list.list, 'group(list.list, 10)')
    // console.log(currentPage.value, 'currentPage.value')
    recordList.list = group(list.list, 10).slice(currentPage.value -1, currentPage.value)[0]
    console.log(recordList.list, 'recordList.list')
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};

const pageChange = () => {
  recordList.list = group(list.list, 10).slice(currentPage.value -1 , currentPage.value)[0]
}

const toExtract = async () => {
  proxy.$showLoadingToast({});
  try {
    const inviteContract = ContractConnect(richPlanInvite, rpcProvider, inviteAbi)
    const tx = await inviteContract.connect(getSigner()).withdrawReward();
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

.main_title {
  color: #FFF;
  text-align: center;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.main_desc {
  color: #FFF;
  text-align: center;
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

.data_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.75rem;
  margin-bottom: 1.75rem;
}

.data-item {
  width: 33.3%;
  text-align: center;
}

.data-data {
  color: #FFF;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.1rem;
  .data-num {
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      font-size: 1.2rem;
      margin-right: 0.2rem;
    }
  }
}

.data-title {
  color: #FFF;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-top: 0.22rem;
}

.data-line {
  width: 1px;
  height: 2rem;
  background: rgba(255, 255, 255, 0.50);
  box-shadow: 0px 0px 10px 0px #2E59FF;
}

.record_list {
  margin-top: 0.6rem;
}

.record_item {
  display: flex;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  flex-wrap: wrap;
  padding: 0.6rem 1.2rem 0;
  margin-bottom: 1rem;

  .item {
    width: 50%;
    margin-bottom: 0.8rem;

    .item_title {
      color: rgba(255, 255, 255, 0.50);
      font-size: 0.75rem;
      font-style: normal;
    }

    .item_data {
      color: #FFF;
      font-size: 0.75rem;
      font-style: normal;
      font-weight: 700;
      word-wrap: break-word;
    }
  }
}</style>
  