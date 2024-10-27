<template>
  <section class="container">
    <HeaderTitle :headTitle="'SCT Token Info'" />
    <ul class="tokenlist">
      <li><span>Total Supply: </span>{{ proxy.$utils.formatNumber(totalSupply) }}</li>
      <li><span>Circulation: </span>{{ proxy.$utils.formatNumber(circulation) }}</li>
      <li><span>Treasury: </span>{{ proxy.$utils.formatNumber(treasury) }}</li>
      <li><span>Ecological Pool: </span>{{ proxy.$utils.formatNumber(ecologicalPool) }}</li>
      <li><span>Planet Mining Pool: </span>{{ proxy.$utils.formatNumber(planetMiningPool) }}</li>
      <li><span>Planet Box: </span>{{ proxy.$utils.formatNumber(planetBox) }}</li>
      <li><span>Facility Box: </span>{{ proxy.$utils.formatNumber(facilityBox) }}</li>
      <li><span>Fuel Shop: </span>{{ proxy.$utils.formatNumber(fuelShop) }}</li>
      <li><span>LP: </span>{{ proxy.$utils.formatNumber(lP) }}</li>
    </ul>
    <div id="dexscreener-embed">
      <iframe
        src="https://dexscreener.com/bsc/0x15C767f32b04a4d3d29D90AE4b3C20506e441AD6?embed=1&theme=dark&info=0"></iframe>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance, computed, watch } from 'vue';
import { erc20, token, contract, util } from 'starcraft-sdk';
const { proxy } = getCurrentInstance() as any;

const totalSupply = ref(0);
const treasury = ref(0);
const ecologicalPool = ref(0);
const planetMiningPool = ref(0);
const planetBox = ref(0);
const facilityBox = ref(0);
const fuelShop = ref(0);
const lP = ref(0);
const projectParty = ref(0);
const circulation = ref(0);
const queryCount = ref(0);

watch(queryCount, (newVal) => {
  if (newVal == 8) {
    getProjectParty();
  } else if (newVal == 17) {
    // Circulation: sct().totalSupply() - Treasury余额 - Ecological Pool余额 - Planet Mining Pool余额 - Planet Box余额 - Facility Box余额 - Fuel Shop余额 - LP余额 - 项目方钱包余额
    circulation.value =
      totalSupply.value -
      treasury.value -
      ecologicalPool.value -
      planetMiningPool.value -
      planetBox.value -
      facilityBox.value -
      fuelShop.value -
      lP.value -
      projectParty.value;
    // console.log(queryCount.value, 'Circulation: ', circulation.value);
  }
});

onMounted(() => {
  getData();
});

const getData = () => {
  // Total Supply: sct().totalSupply()
  erc20(token().SCT)
    .totalSupply()
    .then((res) => {
      totalSupply.value = Math.round(proxy.$utils.utilFormat(util.formatEther(res)));
      queryCount.value++;
      // console.log(queryCount.value, 'Total Supply: ', totalSupply.value);
    });
  // Treasury: sct().balanceOf(sct().treasury())
  erc20(token().SCT)
    .balanceOf('0xa107aBb13441fA3651B4A3a56F65B7337c970A76')
    .then((res) => {
      treasury.value = Math.round(proxy.$utils.utilFormat(util.formatEther(res)));
      queryCount.value++;
      // console.log(queryCount.value, 'Treasury: ', treasury.value);
    });
  // Ecological Pool: sct().balanceOf('0x81f4c176b0B1425E1e5C562E28a9575693058abb')
  erc20(token().SCT)
    .balanceOf('0x81f4c176b0B1425E1e5C562E28a9575693058abb')
    .then((res) => {
      ecologicalPool.value = Math.round(proxy.$utils.utilFormat(util.formatEther(res)));
      queryCount.value++;
      // console.log(queryCount.value, 'Ecological Pool: ', ecologicalPool.value);
    });
  // Planet Mining Pool: sct().balanceOf(contract().PlanetPool)
  erc20(token().SCT)
    .balanceOf(contract().PlanetPool)
    .then((res) => {
      planetMiningPool.value = Math.round(proxy.$utils.utilFormat(util.formatEther(res)));
      queryCount.value++;
      // console.log(queryCount.value, 'Planet Mining Pool: ', planetMiningPool.value);
    });
  // Planet Box: sct().balanceOf(contract().SCPBox)
  erc20(token().SCT)
    .balanceOf(contract().SCPBox)
    .then((res) => {
      planetBox.value = Math.round(proxy.$utils.utilFormat(util.formatEther(res)));
      queryCount.value++;
      // console.log(queryCount.value, 'Planet Box: ', planetBox.value);
    });
  // Facility Box: sct().balanceOf(contract().SCFBox)
  erc20(token().SCT)
    .balanceOf(contract().SCFBox)
    .then((res) => {
      facilityBox.value = Math.round(proxy.$utils.utilFormat(util.formatEther(res)));
      queryCount.value++;
      // console.log(queryCount.value, 'Facility Box: ', facilityBox.value);
    });
  // Fuel Shop: sct().balanceOf(contract().Shop)
  erc20(token().SCT)
    .balanceOf(contract().Shop)
    .then((res) => {
      fuelShop.value = Math.round(proxy.$utils.utilFormat(util.formatEther(res)));
      queryCount.value++;
      // console.log(queryCount.value, 'Fuel Shop: ', fuelShop.value);
    });
  // LP: sct().balanceOf('0x15c767f32b04a4d3d29d90ae4b3c20506e441ad6')
  erc20(token().SCT)
    .balanceOf('0x15c767f32b04a4d3d29d90ae4b3c20506e441ad6')
    .then((res) => {
      lP.value = Math.round(proxy.$utils.utilFormat(util.formatEther(res)));
      queryCount.value++;
      // console.log(queryCount.value, 'LP: ', lP.value);
    });
};
const getProjectParty = () => {
  // 项目方钱包地址
  const projectParties = [
    '0x9e2b223d00d79b28ab4331adf673335c793da0af',
    '0x014bc7268ca3c766e890ca3f627a8ce39a5ec36c',
    '0x75306533ffb2f037d8a166529f6029748568aa5c',
    '0x175cacf955e08d2ee2936f904102d2d07a249117',
    '0xfe5a56a96b4ec5b035fb359e671e35e5c4a7386d',
    '0xa66d0f61f607c0d3aaf632e3bb964954cb37fe55',
    '0xF977D5883D9a4dFFA1d30885140FDed7F6d59252',
    '0x451888A66Ab9d3F9534B03A3AAA0D029d2C95748',
    '0xa938BEb011E9Bd3D20b9Fa41F0E4874AB8816c2B'
  ];
  projectParties.forEach((element) => {
    erc20(token().SCT)
      .balanceOf(element)
      .then((res) => {
        const balance = Math.round(proxy.$utils.utilFormat(util.formatEther(res)));
        projectParty.value += balance;
        queryCount.value++;
        // console.log(queryCount.value, element, projectParty.value);
      });
  });
};
</script>

<style lang="scss" scoped>
.tokenlist {
  padding: 0 15px 15px;
  display: flex;
  flex-wrap: wrap;
  li {
    width: 50%;
    font-size: 12px;
  }
}

#dexscreener-embed {
  position: relative;
  width: 100%;
  padding-bottom: 120%;
}

#dexscreener-embed iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 0;
}
</style>
