import { SCPBox2__factory } from 'starcraft-core/typechain-types';
import { rpcProvider } from '../utils';
import { contract } from '../constant';

export function scpBox2() {
  return SCPBox2__factory.connect(contract().SCPBox2, rpcProvider);
}
