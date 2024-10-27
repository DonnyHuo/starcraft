import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import walletUtils from '@/globalUtil/walletUtils';
export default createStore({
  state: {
    walletAccount: '',
    inviteCode: '',
    isShowRichPlanDialog: true
  },
  getters: {},
  mutations: {
    setWalletAccount(state, data) {
      state.walletAccount = data;
    },
    setInviteCode(state, data) {
      state.inviteCode = data;
    },
    setBalance(state, { tokenKey, balance }) {
      state[`balance${tokenKey}`] = balance;
    },
    setIsShowRichPlanDialog(state, data) {
      state.isShowRichPlanDialog = data;
    },
  },
  actions: {
    async getBalance({ commit }, tokenData) {
      const tokenKey = Object.keys(tokenData)[0];
      const tokenValue = tokenData[tokenKey];
      try {
        const balance = await walletUtils.getBalance(tokenValue);
        commit('setBalance', { tokenKey, balance });
      } catch (err) {
        console.error(err);
        commit('setBalance', { tokenKey, balance: 0 });
      }
    }
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer(val: any) {
        return {
          walletAccount: val.walletAccount,
          inviteCode: val.inviteCode
        };
      }
    })
  ]
});
