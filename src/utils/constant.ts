export function token(env?: string) {
  const environment = env || process.env.NODE_ENV;
  if (environment === 'production') {
    return {
      SCT: '0x7A27F0419289d703896877594B93a023828585e4',
      SCP: '0x2D03AE9501a6e10299eaf0C035Fb7766b5bFDdA3',
      SCF: '0x3DF7bec1746AD1a5Ed404D8DCe9786F09734c086',
      FUEL: '0x3DD0623c9e2DC16fA9d4280006C0462e646a034a',
      ADFUEL: '0xC6962A56A58D3FC2c8c0Fbe38100B27699A6df4F',
      FILW: '0x910D48c7212fF50e19849C39c245b6f5bA83c72A',
      L3: '0x7b97bCfC11054F1cF2e07dE9a9C449677E64DeA8',
      USDT: '0x55d398326f99059fF775485246999027B3197955',
    }
  } else {
    return {
      SCT: '0x66513ada3c2A47805307006649218f098a207b53',
      SCP: '0xB9c521615E7A5fa6B7694422790c354BaC9e78Af',
      SCF: '0x5cEb789d037e35b4DAE1E7fEF474e73F49042901',
      FUEL: '0xB17C55a3255710be2253B52011c1C7372DF39E7B',
      ADFUEL: '0xFAab7D1882351BC4099b02EA432Ec64b1496a7aa',
      FILW: '0x5319395c1AA841365293B11473AB2cd72644fE2D',
      L3: '0x21BE1d43Ca69EE0E978aD4d1807Da2feE29D23d4',
      USDT: '0xC773BA32c3b0fB39362B3D8AE8e3db137FD7f040',
    };
  }
};

export function contract(env?: string) {
  const environment = env || process.env.NODE_ENV;
  if (environment === 'production') {
    return {
      Inviting: '0x21353e042119512bA36bC83647224B94c0455fd7',
      Shop: '0x3FafA355374A231008A3eD7C62e690dBeed3170C',
      Shop2: '0xA8F4765693905cAB7752226018D6b2d41567b9b0',
      SCPBox: '0x6170461B89b44c2Baab9A542172C564870b2d349',
      SCPBox2: '0xF9507d5524343c4a18c7b2c62Bc39Bf3949BCB07',
      SCFBox: '0x16A562328BB854Ce4A6A4622fCf9954b21194f21',
      PlanetPool: '0x206707B2cC8AE6DDC2D24278Eb0Ee72e25374111',
      BuyNode: '0x4dc0796E28E62E6A54f605480893Cc140Af3136E',
      Airdrop: '0x21cA829787ff4E638fCAef5B6809A85e8F22ad3E',
    }
  } else {
    return {
      Inviting: '0x6C43aD6b8DCe5F553Bf3b42fED8F181F19f2Ec57',
      Shop: '0x63295f6348b620d9cF6006B4CD8103803FA5F6e1',
      Shop2: '0x8d48D46CaA4ef5368ffEb8458B53eF3c26E2077C',
      SCPBox: '0x20c05d568D4360c77Da8E91120b0793472FF0577',
      SCPBox2: '',
      SCFBox: '0xdB5496c69867dA1De65a6711735D70B7Ced42931',
      PlanetPool: '0xFA24fbE911Bb94Ab70737F38e69947074d7B65C6',
      BuyNode: '0x64308c8abFD55E81F88369AD098c8318a84f3AB1',
      Airdrop: '',
    };
  }
};

export function network(env?: string) {
  const environment = env || process.env.NODE_ENV;
  if (environment === 'production') {
    return {
      chainId: '0x38',
      chainName: 'BSC-Mainnet',
      rpcUrls: ['https://bsc-dataseed4.ninicoin.io/']
    };
  } else {
    return {
      chainId: '0x61',
      chainName: 'BSC-Testnet',
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/']
    };
  }
};