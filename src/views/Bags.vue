<template>
  <section class="container">
    <HeaderTitle :headTitle="'Bags'" />
    <div class="container2">
      <ul class="baglist">
        <li v-for="(item, index) in NFTList.list" :key="index" @click="openBagsItem(item)">
          <img :src="item.image" alt="" />
        </li>
      </ul>
    </div>
    <van-popup v-model:show="showBagsItem" :style="{ background: 'transparent' }">
      <div class="popupbox1">
        <img class="closebtn" :src="img32" alt="" @click="closeBagsItem" />
        <div class="popup_BagsItem">
          <img :src="NFTInfo.image" alt="" />
          <p>{{ NFTInfo.name }}</p>
          <div class="attr">
            <img :src="img37" alt="" />
            <div>
              <div class="title2">
                <span>Energy</span> <span>{{ NFTInfo.attributes.Energy }}</span>
              </div>
              <div class="progress2">
                <i
                  v-for="(item, index) in 12"
                  :key="index"
                  :class="{ active: index + 1 <= NFTInfo.attributes.Energy }"></i>
              </div>
            </div>
          </div>
          <button class="btn2" @click="closeBagsItem">Close</button>
        </div>
      </div>
    </van-popup>
  </section>
</template>

<script lang="ts" setup>
import img32 from '@/assets/images/img32.svg';
import img37 from '@/assets/images/img37.svg';
import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue';
import { useStore } from 'vuex';
import { scf } from '@/utils';
const { proxy } = getCurrentInstance() as any;
const store = useStore();
const walletAccount = computed(() => store.state.walletAccount);
const showBagsItem = ref(false);
const NFTIdList: any = ref([]);
const NFTList: any = reactive({ list: [] });
const NFTInfo: any = ref(null);

onMounted(() => {
  if (walletAccount.value) {
    getNFTIdList();
  }
});

const getNFTIdList = async () => {
  proxy.$showLoadingToast({});
  try {
    const res = await scf().tokensOfOwnerBySize(walletAccount.value, 0, 1000);
    NFTIdList.value = res[0].map((item) => Number(item));
    getSCFList();
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};

const getSCFList = async () => {
  proxy.$showLoadingToast({});
  try {
    const nftInfoPromises = NFTIdList.value.map(async (element) => {
      try {
        const res = await scf().tokenURI(element);
        const base64Data = res.split(',')[1];
        const decodedData = atob(base64Data);
        const jsonData = JSON.parse(decodedData);
        const attributes = jsonData.attributes.reduce((acc, attribute) => {
          acc[attribute.trait_type] = attribute.value;
          return acc;
        }, {});
        jsonData.attributes = attributes;
        return jsonData;
      } catch (err) {
        console.error(err);
        return null;
      }
    });
    const nftInfoList = await Promise.all(nftInfoPromises);
    NFTList.list = nftInfoList.filter((item) => item !== null);
    proxy.$closeToast();
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};

const openBagsItem = (item) => {
  showBagsItem.value = true;
  NFTInfo.value = item;
};
const closeBagsItem = () => {
  showBagsItem.value = false;
};
</script>

<style lang="scss" scoped>
.container2 {
  width: 100%;
  padding: 0 15px;
}

.baglist {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  li {
    margin: 12px;
    width: 90px;
    height: 100px;
    background: hsla(0, 0%, 100%, 0.1);
    box-shadow: inset 0 6px 16px 0 rgba(2, 7, 32, 0.5);
    border-radius: 4px;
    border: 2px solid #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
