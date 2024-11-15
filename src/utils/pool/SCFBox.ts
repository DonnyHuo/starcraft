import { SCFBox__factory } from 'starcraft-core/typechain-types';
import { rpcProvider } from '../utils';
import { contract } from '../constant';

export function scfBox() {
  return SCFBox__factory.connect(contract().SCFBox, rpcProvider);
}
