import { wallet, network, util, erc20 } from 'starcraft-sdk';
import store from '@/stores';
import utils from '@/globalUtil';
export default {
  /**
   * 连接钱包
   * @param walletType 准备连接的钱包类型
   * @  wallet.getAccount() 获取已连接的钱包地址
   * @  wallet.getChainId() 获取已连接的网络ID
   * @  onAccountChanged  监听帐户变化1
   * @  onChainChanged  监听网络变化1
   */
  async walletConnect(walletType: string = 'metamask') {
    try {
      const accounts = await wallet.getAccount(walletType);
      const chainId = await wallet.getChainId();
      this.handleAccountsChanged(accounts);
      this.handleChainChanged(chainId);
      wallet.onAccountChanged(this.handleAccountsChanged);
      wallet.onChainChanged(this.handleChainChanged);
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  },
  /**
   * 帐户变化触发
   * @param accounts 已连接的钱包地址
   */
  handleAccountsChanged(accounts: string[]) {
    const address = util.getAddress(accounts[0]);
    const currentAddress = store.state.walletAccount;
    if (address !== currentAddress) {
      store.commit('setWalletAccount', address);
      location.reload();
    }
  },
  /**
   * 网络变化触发
   * @param chainId 已连接的网络ID
   */
  handleChainChanged(chainId: string) {
    if (chainId !== network().chainId) {
      wallet.addChain();
    }
  },
  /**获取余额 */
  async getBalance(token: string) {
    try {
      const res = await erc20(token).balanceOf(store.state.walletAccount);
      const balance = utils.utilFormat(util.formatEther(res));
      return balance;
    } catch (err) {
      console.error(err);
    }
  },
  /**检查授权 */
  async checkApprove(token: string, contract: string, balance: any) {
    try {
      const res = await erc20(token).allowance(store.state.walletAccount, contract);
      const quota = utils.utilFormat(util.formatEther(res.toString()));
      const isApprove = quota >= balance;
      return isApprove;
    } catch (err) {
      console.error(err);
    }
  }
};
