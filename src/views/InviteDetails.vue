<template>
  <section class="container">
    <HeaderTitle :headTitle="'Invitation Relationship'" />
    <div class="container2">
      <div class="text">
        <p>Direct friends: {{ infoList.info.directCount || 0 }}</p>
        <p>Indirect friends: {{ infoList.info.indirectCount || 0 }}</p>
      </div>
      <div class="listbox">
        <div class="th">
          <p>Address</p>
          <p>Sort</p>
          <p>TXid</p>
        </div>
        <ul v-if="infoList.list.length > 0">
          <li v-for="(item, index) in infoList.list" :key="index">
            <p>{{ proxy.$utils.ellipsisWallet(item.user) }}</p>
            <p>
              {{ Number(item.type) == 0 ? 'Direct' : 'Indirect' }}
            </p>
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
import { reactive, onMounted, getCurrentInstance, computed } from 'vue';
import { useStore } from 'vuex';
import { invitingInfo } from 'starcraft-sdk';
const { proxy } = getCurrentInstance() as any;
const store = useStore();

const walletAccount = computed(() => store.state.walletAccount);
const queryParams = reactive({
  first: 1000,
  skip: 0,
  orderBy: 'timestamp',
  orderDirection: 'desc',
  inviter: '', // 邀请人地址？
  user: '' // 用户地址？
});
const queryParams2 = reactive({
  first: 1000,
  skip: 0,
  orderBy: 'usersCount',
  orderDirection: 'desc',
  inviter: '' // 邀请人地址？
});
const infoList: any = reactive({
  list: [],
  info: {}
});
onMounted(() => {
  if (walletAccount.value) {
    getBindInfos();
    getCounters();
  }
});
const getBindInfos = () => {
  proxy.$showLoadingToast({});
  const { first, skip, orderBy, orderDirection } = queryParams;
  invitingInfo
    .getBindInfos(first, skip, orderBy, orderDirection, walletAccount.value, '')
    .then((res) => {
      if (res.data.bindInfos.length > 0) {
        infoList.list.push(...res.data.bindInfos);
        if (res.data.bindInfos.length >= queryParams.first) {
          queryParams.skip = queryParams.skip + queryParams.first;
          getBindInfos();
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
const getCounters = () => {
  proxy.$showLoadingToast({});
  const { first, skip, orderBy, orderDirection } = queryParams2;
  invitingInfo
    .getCounters(first, skip, orderBy, orderDirection, walletAccount.value)
    .then((res) => {
      if (res.data.counters.length > 0) {
        const { usersCount, directCount, indirectCount } = res.data.counters[0];
        infoList.info = {
          usersCount: Number(usersCount),
          directCount: Number(directCount),
          indirectCount: Number(indirectCount)
        };
      }
      proxy.$closeToast();
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
  padding: 0 15px;
}
.text {
  p {
    font-size: 20px;
    line-height: 40px;
    text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
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
        width: 40%;
      }
      &:nth-child(2) {
        width: 20%;
        text-align: center;
      }
      &:nth-child(3) {
        width: 40%;
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
