import { SCPBox__factory } from 'starcraft-core/typechain-types';
import { rpcProvider } from '../utils';
import { contract } from '../constant';

export function scpBox() {
  return SCPBox__factory.connect(contract().SCPBox, rpcProvider);
}
