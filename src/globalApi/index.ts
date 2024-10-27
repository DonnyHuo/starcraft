import axios from 'axios';

axios.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default {
  async getCoinPrice(data: any) {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price/?ids=${data}&vs_currencies=usd`);
    return response.data;
  },
  async getBTCInfo() {
    const response = await axios.get(`https://chain.api.btc.com/v3/block/latest`);
    return response.data;
  },
  async getBlockInfo(data: any) {
    const response = await axios.get(
      `https://api.bscscan.com/api?module=block&action=getblocknobytime&timestamp=${data}&closest=before&apikey=DW7MKIA4J6KX51ZX8PTCXGNU7QINAZZT3Y`
    );
    return response.data;
  },
  async getIpfsVersion() {
    const response = await axios.get(`https://version.starcraft.vip/ipfsVersion.json`);
    return response.data;
  }
};
