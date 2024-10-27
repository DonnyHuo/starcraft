<template>
  <section class="container">
    <HeaderTitle :headTitle="'My Reward'" />
    <div class="container2 container3">
      <div class="text">
        <p>
          My Node Type:
          <span v-if="isPurchased == 1">Basic node</span>
          <span v-if="isPurchased == 2">Super node</span>
        </p>
        <p>
          My Team Energy: <span>{{ totalEnergy }}</span>
        </p>
      </div>
      <div class="listbox">
        <div class="th">
          <p>Time</p>
          <p>Earnings</p>
          <p>TXid</p>
        </div>
        <ul v-if="infoList.list.length > 0">
          <li v-for="(item, index) in infoList.list" :key="index">
            <p>{{ item.timestamp.split(' ')[0] }} <br />{{ item.timestamp.split(' ')[1] }}</p>
            <p>+ {{ proxy.$utils.formatNumber(item.amount) }} SCT</p>
            <p>
              <a :href="'https://bscscan.com/tx/' + item.hash" target="_blank">
                {{ proxy.$utils.ellipsisWallet(item.hash) }}
              </a>
            </p>
          </li>
        </ul>
        <div v-else class="nodata">No data</div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue';
import { useStore } from 'vuex';
import { util, planetPool, planetPoolInfo, buyNode } from 'starcraft-sdk';
const { proxy } = getCurrentInstance() as any;
const store = useStore();
const walletAccount = computed(() => store.state.walletAccount);
const isPurchased = ref(0);
const totalEnergy = ref(0);
const queryParams = reactive({
  first: 1000,
  skip: 0,
  orderBy: 'timestamp',
  orderDirection: 'desc',
  user: '',
  block: 0
});
const infoList: any = reactive({ list: [] });

onMounted(() => {
  if (walletAccount.value) {
    getIsPurchased();
    getUserStakes();
    getHarvestInfos();
  }
});
/**获取某用户已购买的节点类型（0是没有购买节点，1是普通节点，2是超级节点） */
const getIsPurchased = async () => {
  proxy.$showLoadingToast({});
  try {
    const res = await buyNode().isPurchased(walletAccount.value);
    isPurchased.value = Number(res);
    proxy.$closeToast();
    // console.log('获取某用户已购买的节点类型（0是没有购买节点，1是普通节点，2是超级节点）', Number(res));
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};

/**获取某用户某ID的币种质押能量（ID传1） */
const getUserStakes = async () => {
  try {
    const res = await planetPool().userStakes(walletAccount.value, 1);
    totalEnergy.value = Number(res);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取用户领取赛马收益记录； */
const getHarvestInfos = () => {
  proxy.$showLoadingToast({});
  const { first, skip, orderBy, orderDirection } = queryParams;
  planetPoolInfo
    .getHarvestInfos(first, skip, orderBy, orderDirection, walletAccount.value)
    .then((res) => {
      if (res.data.harvestInfos.length > 0) {
        let list: any = [];
        res.data.harvestInfos.forEach((element: any) => {
          const obj = {
            timestamp: proxy.$utils.formatDate(element.timestamp * 1000),
            hash: element.hash,
            user: element.user,
            amount: proxy.$utils.utilFormat(util.formatEther(element.amount))
          };
          list.push(obj);
        });
        infoList.list = [...infoList.list, ...list];
        if (res.data.harvestInfos.length >= queryParams.first) {
          queryParams.skip = queryParams.skip + queryParams.first;
          getHarvestInfos();
        } else {
          proxy.$closeToast();
        }
      } else {
        proxy.$closeToast();
      }
    })
    .catch((err) => {
      console.error(err);
      proxy.$showFailToast('Error');
    });
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
