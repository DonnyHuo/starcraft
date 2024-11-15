<template>
  <section class="container">
    <HeaderTitle :headTitle="'Mining'" />
    <div class="exp" v-if="isMining && !isMaxLevel">
      <div class="box">
        <i :style="`width: ${(remainEXP / allEXP) * 100}%`"></i>
        <img :src="img16" alt="" />
        <p>{{ remainEXP }}/{{ allEXP }}</p>
      </div>
      <img class="upgrade" :src="img48" alt="" v-if="remainEXP >= allEXP" @click="toUpgradePlanet" />
    </div>
    <div class="infobox">
      <ul class="info">
        <li>
          <img :src="img36" alt="" />
          <div class="rightbox">
            <div class="title">
              <span>Durability</span> <span>{{ remainDurability }}/{{ nftAttributes.Durability || 0 }}</span>
            </div>
            <div class="progress">
              <i :style="`width: ${(remainDurability / nftAttributes.Durability || 0) * 100}%`"></i>
            </div>
          </div>
        </li>
        <li class="li2">
          <img :src="img37" alt="" />
          <div class="rightbox">
            <div class="title">
              <span>Energy</span> <span>{{ nftAttributes.Energy || 0 }}</span>
            </div>
            <div class="progress2">
              <i v-for="(item, index) in 12" :key="index" :class="{ active: index + 1 <= nftAttributes.Energy }"></i>
            </div>
          </div>
        </li>
        <li class="li2">
          <img :src="img31" alt="" />
          <div class="rightbox">
            <div class="title">
              <span>Attack</span> <span>{{ nftAttributes.Attack || 0 }}</span>
            </div>
            <div class="progress2">
              <i v-for="(item, index) in 12" :key="index" :class="{ active: index + 1 <= nftAttributes.Attack }"></i>
            </div>
          </div>
        </li>
      </ul>
      <div class="energy" v-if="isMining">
        <img :src="img38" alt="" />
        <p>Total energy: {{ totalEnergy }}</p>
      </div>
    </div>
    <div class="container2" v-if="nftId > 0">
      <Star :isMining="isMining" :stopAni="stopAni" :nftName="nftName" :nftImage="nftImage"></Star>
      <div class="time">
        <img :src="img39" alt="" />
        <p>{{ nftName }}</p>
      </div>
      <div class="timed" v-if="isMining">
        <p>
          <span>
            Remain Fuel:
            <CountTo class="total" :startVal="remainFuel_" :endVal="remainFuel" :duration="1000" :decimals="4" />
          </span>
          <button class="btn" v-if="showAddFuelBtn" @click="openAddFuel">Add Fuel</button>
        </p>
        <p>Total Minging Time: {{ totalMingingTime }}</p>
        <p>Current Block Reward: {{ proxy.$utils.formatNumber(tokensPerBlock, 4) }} SCT</p>
        <p>Current Mining Plant: {{ scpIdsLength }}</p>
        <p>Current Mining Energy: {{ stakes }}</p>
      </div>
      <template v-if="isMining">
        <div class="Navigation">
          <div @click="openFacility">
            <img :src="img41" alt="" />
            <p>Facility</p>
          </div>
          <div @click="stopMining">
            <img :src="img45" alt="" />
            <p>Stop Mining</p>
          </div>
          <div @click="toClaim">
            <div class="profit">
              <img :src="SCT" alt="" />
              <span>
                <CountTo class="total" :startVal="tokenRewards_" :endVal="tokenRewards" :duration="1000" :decimals="4" />
              </span>
            </div>
            <img :src="img33" alt="" />
            <p>Claim</p>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="Navigation">
          <div @click="openStartMining">
            <img :src="img45" alt="" />
            <p>Start Minging</p>
          </div>
          <div @click="openInjectDurability" v-if="remainDurability < nftAttributes.Durability">
            <img :src="img45" alt="" />
            <p>Inject Durability</p>
          </div>
        </div>
      </template>
    </div>
    <van-popup v-model:show="showAddFuel" :style="{ background: 'transparent' }">
      <div class="popupbox1">
        <img class="closebtn" :src="img32" alt="" @click="showAddFuel = false" />
        <div class="title">Inject fuel</div>
        <div class="popup_AddFuel">
          <p>Consumption {{ speed0 }}/day</p>
          <img class="img1" :src="img19" alt="" />
          <p>You can inject up to</p>
          <input type="number" v-model="inputVal" />
          <p>Balance: {{ proxy.$utils.formatNumber(balanceFUEL) }}</p>
          <button v-if="isApproveFUEL" @click="addFuel">Start injecting</button>
          <button v-else @click="toApproveFUEL">Approve FUEL</button>
        </div>
      </div>
    </van-popup>
    <van-popup v-model:show="showInjectDurability" :style="{ background: 'transparent' }">
      <div class="popupbox1">
        <img class="closebtn" :src="img32" alt="" @click="showInjectDurability = false" />
        <div class="title">Inject fuel</div>
        <div class="popup_AddFuel">
          <p>Injecting advanced fuel restores Earth's durability 1:1</p>
          <img class="img1" :src="img18" alt="" />
          <p>You can inject up to</p>
          <input type="number" v-model="inputVal" @input="onInput" />
          <p>Balance: {{ proxy.$utils.formatNumber(balanceADFUEL) }}</p>
          <button v-if="isApproveADFUEL" @click="addDurability">Start injecting</button>
          <button v-else @click="toApproveADFUEL">Approve ADFUEL</button>
        </div>
      </div>
    </van-popup>
    <van-popup v-model:show="showFacility" position="bottom">
      <div class="popupbox2">
        <div class="title">Mining Facility</div>
        <div class="popup_StartMining">
          <ul class="list list2">
            <li v-for="(item, index) in scfList.list" :key="index">
              <div class="itembox">
                <img :src="img29" alt="" />
                <div class="item">
                  <div class="img">
                    <img :src="item.image" alt="" />
                  </div>
                  <div class="index">{{ index + 1 }}</div>
                  <div class="text">
                    <p>{{ item.name }}</p>
                    <p class="text2">Energy:{{ item.attributes.Energy }}</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
    <van-popup v-model:show="showStartMining" position="bottom">
      <div class="popupbox2">
        <div class="popup_StartMining">
          <ul class="list">
            <li v-for="(item, index) in selectedSCFList" :key="index">
              <div class="itembox">
                <img :src="img29" alt="" />
                <div class="item">
                  <div class="img">
                    <img v-if="item" :src="item.image" alt="" />
                  </div>
                  <div class="index">{{ index + 1 }}</div>
                  <div class="text">
                    <template v-if="item">
                      <p>{{ item.name }}</p>
                      <p class="text2">Energy: {{ item.attributes.Energy }}</p>
                    </template>
                    <p class="text3" v-else>Empty slot</p>
                  </div>
                </div>
              </div>
              <img v-if="item" :src="img47" alt="" @click="openSelectFacility(index)" />
              <img v-else :src="img30" alt="" @click="openSelectFacility(index)" />
            </li>
          </ul>
          <div class="inputbox" v-if="isApproveFUEL && isApproveSCP && isApproveSCF">
            <input type="number" v-model="inputVal" />
            <p>
              <span>Consumption {{ proxy.$utils.formatNumber(speed0) }}/day</span>
              <span>Balance:{{ proxy.$utils.formatNumber(balanceFUEL) }}</span>
            </p>
            <button @click="startGame">Start Game</button>
          </div>
          <div class="inputbox" v-else>
            <button v-if="!isApproveFUEL" @click="toApproveFUEL">Approve FUEL</button>
            <button v-if="!isApproveSCP" @click="toApproveSCP">Approve Planet</button>
            <button v-if="!isApproveSCF" @click="toApproveSCF">Approve Facility</button>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model:show="showSelectFacility" :style="{ background: 'transparent' }">
      <div class="popupbox1">
        <img class="closebtn" :src="img32" alt="" @click="showSelectFacility = false" />
        <div class="title">Select Facility</div>
        <div class="popup_SelectFacility">
          <ul>
            <li v-for="(item, index) in scfList.list" :key="index" @click="selectSCF(item)" :class="{ disabled: item.checked }">
              <img :src="item.image" alt="" />
              <p>Energy:{{ item.attributes.Energy }}</p>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
  </section>
</template>

<script lang="ts" setup>
import img36 from '@/assets/images/img36.svg';
import img37 from '@/assets/images/img37.svg';
import img31 from '@/assets/images/img31.svg';
import img38 from '@/assets/images/img38.svg';
import img16 from '@/assets/images/img16.png';
import img39 from '@/assets/images/img39.svg';
import img41 from '@/assets/images/img41.svg';
import img45 from '@/assets/images/img45.svg';
import img33 from '@/assets/images/img33.svg';
import SCT from '@/assets/images/SCT.svg';
import img18 from '@/assets/images/img18.png';
import img48 from '@/assets/images/img48.png';
import img19 from '@/assets/images/img19.png';
import img32 from '@/assets/images/img32.svg';
import img29 from '@/assets/images/img29.svg';
import img47 from '@/assets/images/img47.svg';
import img30 from '@/assets/images/img30.svg';
import { CountTo } from 'vue3-count-to';
import { ref, reactive, onMounted, getCurrentInstance, computed, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';
import { getProvider, scp, scf, util, erc20, token, contract, getSigner, planetPool, inviting } from '@/utils';
const { proxy } = getCurrentInstance() as any;
const store = useStore();
const walletAccount = computed(() => store.state.walletAccount);
const isMining = ref(false);
const stopAni = ref(true);
const showAddFuel = ref(false);
const showAddFuelBtn = ref(false);
const showFacility = ref(false);
const showStartMining = ref(false);
const showInjectDurability = ref(false);
const showSelectFacility = ref(false);
const nftId: any = ref(0);
const nftName: any = ref('');
const nftImage: any = ref('');
const remainDurability = ref(0);
const balanceADFUEL = ref(0);
const isApproveADFUEL = ref(true);
const balanceFUEL = ref(0);
const isApproveFUEL = ref(true);
const inputVal: any = ref(null);
const isApproveSCP = ref(true);
const isApproveSCF = ref(true);
const speed0 = ref(0);
const speed1 = ref(0);
const scfList: any = reactive({ list: [] });
const selectedSCFList: any = ref([]);
const selectSlotIndex = ref(0);
const totalEnergy = ref(0);
const remainEXP = ref(0);
const allEXP = ref(432000);
const remainFuel = ref(0);
const remainFuel_ = ref(0);
const totalMingingTime = ref('');
const tokensPerBlock = ref(0);
const stakes = ref(0);
const scpIdsLength = ref(0);
const tokenRewards = ref(0);
const tokenRewards_ = ref(0);
let nftAttributes: any = reactive({});
let timer: any = null;
const userLastDepositBlock = ref(0);
const userFuelEndBlock = ref(0);
const userADFuelEndBlock = ref(0);
const blockHeight = ref(0);
const isMaxLevel = ref(false);
const parentAddress = ref('');

onMounted(() => {
  clearInterval(timer);
  if (walletAccount.value) {
    getUserInviter();
    getUserSCPId();
    getBalanceADFUEL();
    getBalanceFUEL();
    checkApproveSCP();
    checkApproveSCF();
  }
});
onBeforeUnmount(() => {
  clearInterval(timer);
});

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

/**获取某用户正在挖矿的星球ID；
如果为0则没在挖矿；
如果大于0则在挖矿； */
const getUserSCPId = async () => {
  proxy.$showLoadingToast({});
  try {
    const res = await planetPool().userSCPId(walletAccount.value);
    isMining.value = Number(res) > 0;
    // console.log('isMining', Number(res));
    if (isMining.value) {
      nftId.value = Number(res);
      getUserStakes();
      getUserSCFIds();
      getUserFuelEndBlock();
      getUserADFuelEndBlock();
      getUserLastDepositBlock();
      timerFun();
      timer = setInterval(() => {
        timerFun();
      }, 3000);
    } else {
      const tokens = await scp().tokensOfOwnerBySize(walletAccount.value, 0, 1000);
      nftId.value = tokens[0].map((item) => Number(item))[0];
      getSCFList();
      getDurability();
    }
    await getNFTList();
    getSpeed();
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
const timerFun = () => {
  getPlanetRemainEXP();
  getUserRemainFuel();
  getTokensPerBlock();
  getSCPIdsLength();
  getStakes();
  getUserRemainDurability();
  getBlockNumber();
  getTokenRewards();
};

/**获取星球 */
const getNFTList = async () => {
  proxy.$showLoadingToast({});
  try {
    const tokenURI = await scp().tokenURI(nftId.value);
    const base64Data = tokenURI.split(',')[1];
    const decodedData = atob(base64Data);
    const jsonData = JSON.parse(decodedData);
    nftName.value = jsonData.name.split('#')[0];
    nftImage.value = jsonData.image;

    console.log(stopAni.value, nftName.value, nftImage.value)

    nftAttributes = jsonData.attributes.reduce((acc, attribute) => {
      acc[attribute.trait_type] = attribute.value;
      return acc;
    }, {});
    const targetString = nftName.value.split('[')[1].charAt(0);
    if (targetString >= 7) isMaxLevel.value = true;
    for (let i = 0; i < Number(nftAttributes.Slot); i++) {
      selectedSCFList.value.push(null);
    }
    proxy.$closeToast();
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取没在挖矿的某星球剩余耐久度； */
const getDurability = async () => {
  try {
    const res = await planetPool().durability(nftId.value);
    remainDurability.value = Number(res);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取设施 */
const getSCFList = async () => {
  proxy.$showLoadingToast({});
  try {
    const res = await scf().tokensOfOwnerBySize(walletAccount.value, 0, 1000);
    const ids = res[0].map((item) => Number(item));
    const nftInfoPromises = ids.map(async (element) => {
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
        jsonData.id = element;
        jsonData.checked = false;
        return jsonData;
      } catch (err) {
        console.error(err);
        return null;
      }
    });
    const nftInfoList = await Promise.all(nftInfoPromises);
    scfList.list = nftInfoList.filter((item) => item !== null);
    proxy.$closeToast();
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取某用户已质押设施ID数组和最新数据指针（传用户钱包地址、0、10）； */
const getUserSCFIds = async () => {
  proxy.$showLoadingToast({});
  try {
    const res = await planetPool().getUserSCFIdsBySize(walletAccount.value, 0, 1000);
    const ids = res[0].map((item) => Number(item));
    const nftInfoPromises = ids.map(async (element) => {
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
        jsonData.id = element;
        jsonData.checked = false;
        return jsonData;
      } catch (err) {
        console.error(err);
        return null;
      }
    });
    const nftInfoList = await Promise.all(nftInfoPromises);
    scfList.list = nftInfoList.filter((item) => item !== null);
    proxy.$closeToast();
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**选择设施 */
const selectSCF = (item) => {
  if (item.checked) return;
  item.checked = true;
  const previousSelectedSCF = selectedSCFList.value[selectSlotIndex.value];
  if (previousSelectedSCF) previousSelectedSCF.checked = false;
  selectedSCFList.value[selectSlotIndex.value] = item;
  showSelectFacility.value = false;
};
/**获取某用户某ID的币种质押能量（ID传0） */
const getUserStakes = async () => {
  try {
    const res = await planetPool().userStakes(walletAccount.value, 0);
    totalEnergy.value = Number(res);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取某用户正在挖矿的某星球剩余经验值；
页面对应字段1：左上角经验条分子（分母一直为432000），分子会有超过分母的情况，这种情况分子改为432000，进度条满 */
const getPlanetRemainEXP = async () => {
  try {
    const res = await planetPool().getPlanetRemainEXP(walletAccount.value, nftId.value);
    remainEXP.value = Number(res);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取某用户剩余燃料 */
const getUserRemainFuel = async () => {
  try {
    remainFuel_.value = remainFuel.value;
    const res = await planetPool().getUserRemainFuel(walletAccount.value);
    remainFuel.value = proxy.$utils.utilFormat(util.formatEther(res));
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取某用户正在挖矿的某星球剩余耐久度；
在挖矿时用该方法获取剩余耐久度； */
const getUserRemainDurability = async () => {
  try {
    const res = await planetPool().getUserRemainDurability(walletAccount.value, nftId.value);
    remainDurability.value = Number(res);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**燃料停止的区块高度 */
const getUserFuelEndBlock = async () => {
  try {
    const res = await planetPool().userFuelEndBlock(walletAccount.value);
    userFuelEndBlock.value = Number(res);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**耐久停止的区块高度 */
const getUserADFuelEndBlock = async () => {
  try {
    const res = await planetPool().userADFuelEndBlock(walletAccount.value);
    userADFuelEndBlock.value = Number(res);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取某用户上次质押时的区块高度；
页面对应字段：Total Minging Time: 0H : 29M（当前区块高度减去上次质押时的区块高度，得到的区块数量*3秒就是挖矿的时长秒数） */
const getUserLastDepositBlock = async () => {
  try {
    const res = await planetPool().userLastDepositBlock(walletAccount.value);
    userLastDepositBlock.value = Number(res);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**当前区块高度 */
const getBlockNumber = async () => {
  try {
    const res = await getProvider().getBlockNumber();
    blockHeight.value = Number(res);
    if (userLastDepositBlock.value) {
      const msec = (Number(res) - userLastDepositBlock.value) * 3;
      totalMingingTime.value = proxy.$utils.getTimeNum(msec);
    }
    // console.log('Fuel', userFuelEndBlock.value);
    // console.log('ADFuel', userADFuelEndBlock.value);
    if (userADFuelEndBlock.value > 0) {
      if (Number(res) >= userADFuelEndBlock.value) {
        stopAni.value = true;
        showAddFuelBtn.value = false;
        clearInterval(timer);
        proxy.$showToast({
          duration: 0,
          message: 'Insufficient durability, please stop mining the planet, add durability, and then start mining'
        });
      } else {
        stopAni.value = false;
        showAddFuelBtn.value = true;
        if (userFuelEndBlock.value > 0) {
          if (Number(res) >= userFuelEndBlock.value) {
            stopAni.value = true;
            clearInterval(timer);
            proxy.$showToast({ duration: 0, message: 'Insufficient fuel, please add fuel' });
          } else {
            stopAni.value = false;
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取某ID的币种每区块产量（传0和1，0和1都是SCT，页面上把这2个产量加起来） */
const getTokensPerBlock = async () => {
  try {
    const res = await planetPool().tokensPerBlock(0);
    const res2 = await planetPool().tokensPerBlock(1);
    tokensPerBlock.value =
      proxy.$utils.utilFormat(util.formatEther(res)) + proxy.$utils.utilFormat(util.formatEther(res2));
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取某ID的币种全网质押能量（传0） */
const getStakes = async () => {
  try {
    const res = await planetPool().stakes(0);
    stakes.value = Number(res);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取全网已质押星球数量； */
const getSCPIdsLength = async () => {
  try {
    const res = await planetPool().getSCPIdsLength();
    scpIdsLength.value = Number(res);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};
/**获取某用户某奖励币种可领取数量（传0和1，加起来） */
const getTokenRewards = async () => {
  tokenRewards_.value = tokenRewards.value;
  try {
    const res = await planetPool().getTokenRewards(walletAccount.value, 0);
    // const res2 = await planetPool().getTokenRewards(walletAccount.value, 1);
    tokenRewards.value =
      proxy.$utils.utilFormat(util.formatEther(res));
    //  + proxy.$utils.utilFormat(util.formatEther(res2))
  } catch (err) {
    console.error(err);
    // proxy.$showFailToast('Error');
  }
};
/**如果传0，获取每区块燃料消耗量；
如果传1，获取1桶高级燃料可持续多少区块 */
const getSpeed = async () => {
  try {
    const res0 = await planetPool().speed(0);
    speed0.value = proxy.$utils.utilFormat(Number(util.formatEther(res0)) * 28800);
    // const res1 = await planetPool().speed(1);
    // speed1.value = proxy.$utils.utilFormat(Number(util.formatEther(res1)) * 28800);
  } catch (err) {
    console.error(err);
    proxy.$showFailToast('Error');
  }
};

/**用户给星球增加剩余耐久度；
需要用户钱包拥有这个星球（用户要先停止挖矿）；
需要剩余耐久度+要增加的剩余耐久度不能大于该星球最大耐久度；
需要先去高级燃料合约(ERC20)授权该合约额度（消耗数量*1e18枚高级燃料代币，增加1*数量耐久度）； */
const addDurability = async () => {
  if (!walletAccount.value) return proxy.$showToast('Please connect wallet');
  if (!inputVal.value) return proxy.$showToast('Please fill out');
  if (inputVal.value > balanceADFUEL.value) return proxy.$showToast('Insufficient balance');
  proxy.$showLoadingToast({});
  try {
    const tx = await planetPool().connect(getSigner()).addDurability(nftId.value, inputVal.value);
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
/**用户添加燃料；
需要用户正在挖矿；
需要燃料大于每天燃料消耗量/28800（也就是至少大于1个区块的燃料消耗量）；
需要先去燃料合约(ERC20)授权该合约额度； */
const addFuel = async () => {
  if (!walletAccount.value) return proxy.$showToast('Please connect wallet');
  if (!inputVal.value) return proxy.$showToast('Please fill out');
  if (inputVal.value > balanceFUEL.value) return proxy.$showToast('Insufficient balance');
  if (inputVal.value <= speed0.value / 28800)
    return proxy.$showToast('Add at least ' + (speed0.value / 28800).toFixed(4));
  proxy.$showLoadingToast({});
  try {
    const tx = await planetPool().connect(getSigner()).addFuel(util.parseUnits(inputVal.value.toString()));
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
/**用户开启星球挖矿；
需要用户钱包拥有这个星球；
需要用户钱包拥有这些设施；
需要用户钱包有足够燃料余额；
需要用户没在挖矿；
需要设施数量不能大于该星球最大设施数量；
需要燃料大于每天燃料消耗量/28800（也就是至少大于1个区块的燃料消耗量）；
需要该星球剩余耐久度大于0；
需要先去星球合约(ERC721)授权该合约额度；
需要先去设施合约(ERC721)授权该合约额度；
需要先去燃料合约(ERC20)授权该合约额度； */
const startGame = async () => {
  if (!walletAccount.value) return proxy.$showToast('Please connect wallet');
  if (!parentAddress.value) return proxy.$showToast('Please go to the invitation page to bind the superior');
  if (remainDurability.value == 0) return proxy.$showToast('The total durability input cannot be 0');
  if (nftAttributes.Energy == 0 && selectedSCFList.value.length == 0)
    return proxy.$showToast('The total energy input cannot be 0');
  if (nftAttributes.Attack == 0 && selectedSCFList.value.length == 0)
    return proxy.$showToast('The total attack input cannot be 0');
  if (!inputVal.value) return proxy.$showToast('Please fill out');
  if (inputVal.value > balanceFUEL.value) return proxy.$showToast('Insufficient balance');
  if (inputVal.value <= speed0.value / 28800)
    return proxy.$showToast('Add at least ' + (speed0.value / 28800).toFixed(4));
  const scfIds = selectedSCFList.value.map((item) => item?.id).filter((id) => id);
  proxy.$showLoadingToast({});
  try {
    const tx = await planetPool()
      .connect(getSigner())
      .deposit(nftId.value, scfIds, util.parseUnits(inputVal.value.toString()));
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
/**用户提取某些奖励币种的收益（传0和1）；
0是收取正常挖矿收益87%；
1是收取赛马收益13%； */
const toClaim = async () => {
  if (!walletAccount.value) return proxy.$showToast('Please connect wallet');
  proxy.$showLoadingToast({});
  try {
    const tx = await planetPool().connect(getSigner()).harvest([0, 1]);
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
/**用户停止挖矿；
需要用户正在挖矿； */
const stopMining = async () => {
  proxy.$showLoadingToast({});
  try {
    const tx = await planetPool().connect(getSigner()).withdraw();
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

/**用户给星球升1级；
需要用户正在挖矿；
需要当前星球等级小于7级；
需要星球剩余经验大于等于432000； */
const toUpgradePlanet = async () => {
  proxy.$showLoadingToast({});
  try {
    const tx = await planetPool().connect(getSigner()).upgradePlanet();
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

const getBalanceADFUEL = async () => {
  balanceADFUEL.value = await proxy.$walletUtils.getBalance(token().ADFUEL);
  isApproveADFUEL.value = await proxy.$walletUtils.checkApprove(
    token().ADFUEL,
    contract().PlanetPool,
    balanceADFUEL.value
  );
};
const getBalanceFUEL = async () => {
  balanceFUEL.value = await proxy.$walletUtils.getBalance(token().FUEL);
  isApproveFUEL.value = await proxy.$walletUtils.checkApprove(token().FUEL, contract().PlanetPool, balanceFUEL.value);
};
const toApproveADFUEL = async () => {
  proxy.$showLoadingToast({});
  try {
    const tx = await erc20(token().ADFUEL)
      .connect(getSigner())
      .approve(contract().PlanetPool, util.parseUnits((1e10).toString()));
    await tx.wait();
    getBalanceADFUEL();
    proxy.$showSuccessToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
const toApproveFUEL = async () => {
  proxy.$showLoadingToast({});
  try {
    const tx = await erc20(token().FUEL)
      .connect(getSigner())
      .approve(contract().PlanetPool, util.parseUnits((1e10).toString()));
    await tx.wait();
    getBalanceFUEL();
    proxy.$showSuccessToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};

/**需要先去星球合约(ERC721)授权该合约额度； scp */
const checkApproveSCP = async () => {
  isApproveSCP.value = await scp().isApprovedForAll(walletAccount.value, contract().PlanetPool);
};
const toApproveSCP = async () => {
  proxy.$showLoadingToast({});
  try {
    let tx = await scp().connect(getSigner()).setApprovalForAll(contract().PlanetPool, true);
    await tx.wait();
    checkApproveSCP();
    proxy.$closeToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};
/**需要先去设施合约(ERC721)授权该合约额度； scf */
const checkApproveSCF = async () => {
  isApproveSCF.value = await scp().isApprovedForAll(walletAccount.value, contract().PlanetPool);
};
const toApproveSCF = async () => {
  proxy.$showLoadingToast({});
  try {
    let tx = await scf().connect(getSigner()).setApprovalForAll(contract().PlanetPool, true);
    await tx.wait();
    checkApproveSCF();
    proxy.$closeToast();
  } catch (err) {
    console.error(err);
    proxy.$closeToast();
  }
};

const openAddFuel = () => {
  showAddFuel.value = true;
};
const openFacility = () => {
  showFacility.value = true;
};
const openStartMining = () => {
  if (!remainDurability.value) return proxy.$showToast('Insufficient durability, please inject durability');
  showStartMining.value = true;
};
const openInjectDurability = () => {
  showInjectDurability.value = true;
};
const openSelectFacility = (index) => {
  showSelectFacility.value = true;
  selectSlotIndex.value = index;
};

const onInput = () => {
  if (inputVal.value !== null) {
    inputVal.value = parseInt(inputVal.value.toString().replace(/\D/g, ''), 10);
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}

.container2 {
  width: 100%;
}

.exp {
  position: absolute;
  left: 15px;
  top: 70px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 9;

  .box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow-x: hidden;
    padding-bottom: 8px;

    img {
      width: 150px;
      height: 18px;
      position: relative;
      z-index: 1;
    }

    i {
      display: block;
      position: absolute;
      z-index: 0;
      height: 17px;
      left: 0;
      background: #4d78ff;
    }

    p {
      font-size: 10px;
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 2;
    }
  }

  .upgrade {
    width: 30px;
    height: 30px;
    background: #ff9f00;
    border-radius: 50%;
    position: absolute;
    left: 100%;
    top: -5px;
  }
}

.infobox {
  position: absolute;
  right: 15px;
  top: 15px;

  .info {
    background: linear-gradient(270deg, rgba(77, 137, 235, 0.3), rgba(42, 48, 66, 0.1) 50%, rgba(77, 137, 235, 0.3));
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 10px;

    li {
      display: flex;
      align-items: center;

      img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }

      .title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #90ad73;
      }

      .progress {
        width: 110px;
        height: 8px;
        margin-top: 2px;
        background: rgba(144, 173, 115, 0.2);

        i {
          height: 100%;
          display: block;
          background: #90ad73;
        }
      }

      .progress2 {
        width: 110px;
        height: 8px;
        margin-top: 2px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        i {
          width: 5%;
          height: 100%;
          background: #d39f53;
          opacity: 0.1;

          &.active {
            opacity: 1;
          }
        }
      }
    }

    .li2 {
      margin-top: 5px;

      .title {
        color: #d39f53;
      }
    }
  }

  .energy {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    img {
      width: 24px;
      height: 24px;
    }

    p {
      font-size: 12px;
      margin-left: 6px;
    }
  }
}

.time {
  width: fit-content;
  display: flex;
  position: relative;
  top: 0;
  left: 50%;

  img {
    width: 20px;
    height: auto;
  }

  p {
    font-size: 12px;
    margin-left: 4px;
  }
}

.timed {
  width: 80%;
  background: rgba(189, 223, 255, 0.2);
  border-radius: 8px;
  margin: 30px auto;
  padding: 10px;

  p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: hsla(0, 0%, 100%, 0.6);
    line-height: 20px;
  }

  .btn {
    padding: 0 5px;
    height: 20px;
    background: rgba(42, 48, 66, 0.3);
    box-shadow: inset 0 0 80px 0 rgba(77, 120, 255, 0.5);
    border-radius: 4px;
    border: 1px solid #fff;
    font-size: 12px;
  }
}

.Navigation {
  width: 100%;
  margin: 30px auto;
  display: flex;
  justify-content: space-around;
  text-align: center;

  >div {
    position: relative;

    >img {
      width: 64px;
      height: 64px;
    }

    >p {
      font-size: 10px;
      color: #a9cbf0;
    }

    .profit {
      width: fit-content;
      display: flex;
      align-items: center;
      font-size: 10px;
      position: absolute;
      top: -10px;
      left: 0;
      right: 0;
      margin: auto;

      img {
        width: 16px;
        height: 16px;
      }
    }
  }
}

.popup_AddFuel {
  p {
    font-size: 14px;
    text-align: center;
  }

  .img1 {
    display: block;
    width: 80px;
    height: 80px;
    margin: 20px auto;
  }

  input {
    width: 250px;
    height: 44px;
    background: #3c4564;
    box-shadow: inset 0 0 10px 0 rgba(77, 120, 255, 0.5);
    border-radius: 4px;
    border: 2px solid #fff;
    font-size: 16px;
    padding: 0 12px;
    color: #fff;
    margin: 20px 0;
    text-align: center;
  }

  button {
    width: 250px;
    height: 44px;
    background: rgba(42, 48, 66, 0.3);
    box-shadow: inset 0 0 80px 0 rgba(77, 120, 255, 0.5);
    border-radius: 4px;
    border: 2px solid #fff;
    font-size: 14px;
    text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
    margin: 20px 0;
  }
}

.popup_Facility {
  width: 275px;
  margin: 0 auto;

  li {
    width: 100%;
    height: 54px;
    margin-top: 20px;
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

      >img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #fff;
      }

      .index {
        width: 40px;
        text-align: center;
        font-size: 22px;
        line-height: 54px;
        text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
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
}

.popup_StartMining {
  .list2 {
    border-top: none !important;

    .itembox {
      margin: 0 auto;
    }
  }

  .list {
    height: 300px;
    overflow-y: auto;
    padding: 15px;
    border-top: 2px solid #fff;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      >img {
        width: auto;
        height: 54px;
      }
    }

    .itembox {
      width: 275px;
      height: 54px;
      position: relative;

      >img {
        width: 100%;
        height: 100%;
      }

      .item {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;

        .img {
          width: 40px;
          height: 40px;
          margin: 0 13px;

          img {
            width: 100%;
            height: 100%;
            background: #fff;
            border-radius: 50%;
          }
        }

        .index {
          width: 20px;
          font-size: 20px;
        }

        .text {
          font-size: 12px;

          .text2 {
            color: #f3c040;
          }

          .text3 {
            color: hsla(0, 0%, 100%, 0.5);
          }
        }
      }
    }
  }

  .inputbox {
    padding: 15px;
    background: hsla(0, 0%, 100%, 0);
    box-shadow: inset 0 0 100px 0 rgba(77, 120, 255, 0.5);
    border-top: 2px solid #fff;

    input {
      width: 100%;
      height: 44px;
      background: #3c4564;
      box-shadow: inset 0 0 10px 0 rgba(77, 120, 255, 0.5);
      border-radius: 4px;
      border: 2px solid #fff;
      font-size: 16px;
      line-height: 44px;
      padding: 0 12px;
    }

    p {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      margin: 10px auto 20px;
    }

    button {
      width: 100%;
      height: 44px;
      background: rgba(42, 48, 66, 0.3);
      box-shadow: inset 0 0 80px 0 rgba(77, 120, 255, 0.5);
      border-radius: 4px;
      border: 2px solid #fff;
      font-size: 14px;
      text-shadow: 0 0 4px rgba(0, 46, 255, 0.6);
      margin: 5px 0;
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
