import { BuyNode__factory } from 'starcraft-core/typechain-types';
import { rpcProvider } from '../utils';
import { contract } from '../constant';

export function buyNode() {
  return BuyNode__factory.connect(contract().BuyNode, rpcProvider);
}
