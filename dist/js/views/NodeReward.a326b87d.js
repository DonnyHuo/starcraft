import{_ as s}from"../HeaderTitle/HeaderTitle.41d7b1f9.js";import{u as t}from"../vuex/vuex.adf06551.js";import{b as a,p as e,m as r,u as o}from"../starcraft-sdk/starcraft-sdk.b9fffec7.js";import{k as i,c as l,r as n,d as m,e as p,A as u,j as c,M as h,x as d,O as j,B as v,F as b,P as f,g as y,C as g,u as k,Q as T,R as w}from"../@vue/@vue.f0ed93ab.js";import{_ as $}from"../vue-count-to/vue-count-to.7851cffd.js";import"../img32/img32.2d4b9acf.js";import"../vue-router/vue-router.6a5eb8ba.js";import"../starcraft-core/starcraft-core.a7e8a7b2.js";import"../@ethersproject/@ethersproject.82fce948.js";import"../bn.js/bn.js.022a57fe.js";import"../aes-js/aes-js.52245d71.js";import"../hash.js/hash.js.951de082.js";import"../minimalistic-assert/minimalistic-assert.62310433.js";import"../inherits/inherits.e883a70c.js";import"../bech32/bech32.0c6cc0e9.js";import"../js-sha3/js-sha3.ce966f76.js";import"../ethers/ethers.7357afd8.js";import"../@apollo/@apollo.167459d8.js";import"../tslib/tslib.cdb03bbf.js";import"../optimism/optimism.dbbdffb5.js";import"../@wry/@wry.ac881673.js";import"../ts-invariant/ts-invariant.73996d61.js";import"../graphql/graphql.c449efb6.js";import"../zen-observable-ts/zen-observable-ts.11549e90.js";import"../symbol-observable/symbol-observable.efed2817.js";import"../graphql-tag/graphql-tag.47c56ce3.js";const x=s=>(T("data-v-baf687ed"),s=s(),w(),s),E={class:"container"},_={class:"container2 container3"},N={class:"text"},F={key:0},I={key:1},q={class:"listbox"},B=x((()=>h("div",{class:"th"},[h("p",null,"Time"),h("p",null,"Earnings"),h("p",null,"TXid")],-1))),M={key:0},S=x((()=>h("br",null,null,-1))),D=["href"],H={key:1,class:"nodata"},R=$(i({__name:"NodeReward",setup(i){const{proxy:T}=y(),w=t(),$=l((()=>w.state.walletAccount)),x=n(0),R=n(0),z=m({first:1e3,skip:0,orderBy:"timestamp",orderDirection:"desc",user:"",block:0}),A=m({list:[]});p((()=>{$.value&&(C(),L(),O())}));const C=async()=>{T.$showLoadingToast({});try{const s=await a().isPurchased($.value);x.value=Number(s),T.$closeToast()}catch(s){T.$showFailToast("Error")}},L=async()=>{try{const s=await e().userStakes($.value,1);R.value=Number(s)}catch(s){T.$showFailToast("Error")}},O=()=>{T.$showLoadingToast({});const{first:s,skip:t,orderBy:a,orderDirection:e}=z;r.getHarvestInfos(s,t,a,e,$.value).then((s=>{if(s.data.harvestInfos.length>0){let t=[];s.data.harvestInfos.forEach((s=>{const a={timestamp:T.$utils.formatDate(1e3*s.timestamp),hash:s.hash,user:s.user,amount:T.$utils.utilFormat(o.formatEther(s.amount))};t.push(a)})),A.list=[...A.list,...t],s.data.harvestInfos.length>=z.first?(z.skip=z.skip+z.first,O()):T.$closeToast()}else T.$closeToast()})).catch((s=>{T.$showFailToast("Error")}))};return(t,a)=>{const e=s;return g(),u("section",E,[c(e,{headTitle:"My Reward"}),h("div",_,[h("div",N,[h("p",null,[d(" My Node Type: "),1==x.value?(g(),u("span",F,"Basic node")):j("",!0),2==x.value?(g(),u("span",I,"Super node")):j("",!0)]),h("p",null,[d(" My Team Energy: "),h("span",null,v(R.value),1)])]),h("div",q,[B,A.list.length>0?(g(),u("ul",M,[(g(!0),u(b,null,f(A.list,((s,t)=>(g(),u("li",{key:t},[h("p",null,[d(v(s.timestamp.split(" ")[0])+" ",1),S,d(v(s.timestamp.split(" ")[1]),1)]),h("p",null,"+ "+v(k(T).$utils.formatNumber(s.amount))+" SCT",1),h("p",null,[h("a",{href:"https://bscscan.com/tx/"+s.hash,target:"_blank"},v(k(T).$utils.ellipsisWallet(s.hash)),9,D)])])))),128))])):(g(),u("div",H,"No data"))])])])}}}),[["__scopeId","data-v-baf687ed"]]);export{R as default};