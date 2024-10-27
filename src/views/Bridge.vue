<template>
  <section class="container">
    <HeaderTitle :headTitle="'Bridge'" />
    <div class="container" style="display: flex; flex-direction: column; align-items: center; font-size: 24px;">
      <div style="display: flex;flex-direction: column;width: 100%;padding: 0 24px;">
        <div style="margin: 12px 0;">
          <select v-model="tokenAddress" v-on:change="getAllowance" style="width: 100%;font-size: 24px; background: none; color: white; padding: 12px; border-radius: 6px; border: 2px solid #fff;">
            <option v-for="item in tokenAddressList" :value="item[1]" :key="item[1]" selected>{{ item[0] }}</option>
          </select>
        </div>
        <div style="margin: 12px 0">
          <input style="width: 100%;" placeholder="Amount Token" v-model="tokenAmount" />
        </div>
        <div style="margin: 12px 0;">
          <input style="width: 100%;" placeholder="Address in Ton network" v-model="toAddress" />
        </div>
        <button class="btn1" @click="transfer" v-if="transferable" :class="{ disabled: processing }">
          Transfer
        </button>
        <button class="btn1" @click="approve" :class="{ disabled: processing }" v-else>
          Approve
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ethers } from 'ethers';
import { getSigner } from 'starcraft-sdk';
import { Address } from '@ton/ton'

const store = useStore();
const route = useRoute();
const tokenAddressList = ref([
  ["SCT", '0x7A27F0419289d703896877594B93a023828585e4'],
  ["FILWT", '0x8fF463fA01f3Ba0C3E1c50f249f57EbfB421e7De'],
  ["FUEL", '0x3DD0623c9e2DC16fA9d4280006C0462e646a034a'],
  ["AD FUEL", '0xC6962A56A58D3FC2c8c0Fbe38100B27699A6df4F'],
])
const tokenAddress = ref(tokenAddressList.value[0][1])
const tokenAmount = ref('')
const toAddress = ref('')
const processing = ref(false)
const transferable = ref(false)
const walletAccount = computed(() => store.state.walletAccount);
const bridgeContract = "0xf503239a8c9ded145263be0b4b274d2972aac1db"

onMounted(() => {
  if (route.query.Bridge) store.commit('Bridge', route.query.Bridge);
  getAllowance()
});


const getAllowance = async () => {
  const contract = new ethers.Contract(tokenAddress.value, ["function allowance(address,address) view returns (uint256)"], getSigner())
  const allowance = await contract.allowance(walletAccount.value, bridgeContract)
  transferable.value = allowance > BigInt(1e18)
}

const approve = async () => {
  const contract = new ethers.Contract(tokenAddress.value, ["function approve(address,uint256)"], getSigner())
  processing.value = true
  contract.approve(bridgeContract, ethers.constants.MaxUint256)
    .then((_: any) => _.wait())
    .then((_: any) => location.reload())
    .catch((_: Error) => alert("Please check your wallet connect!"))
    .finally(() => processing.value = false)
}

const transfer = () => {
  if (!toAddress.value || !tokenAmount.value) {
    alert("Please input the tokenAmount or Address in Ton network!")
    return
  }
  const addressTon = Address.parse(toAddress.value);
  const toAddressHash = addressTon.toRawString().split(":")[1]
  const contract = new ethers.Contract(bridgeContract, ["function lock(address token, uint256 amount, bytes32 to_address_hash)"], getSigner())
  processing.value = true
  contract.lock(
    tokenAddress.value,
    ethers.utils.parseEther(tokenAmount.value),
    "0x" + toAddressHash
  )
    .then((_: any) => _.wait())
    .then((_: any) => alert("Transaction comfirmed!"))
    .catch((_: Error) => alert("Please check your wallet connect and token balance!"))
    .finally(() => processing.value = false)
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  padding: 0 15px;
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

.btn1:active {
  transform: translate(1px, 3px);
}
</style>
