import { Shop__factory } from 'starcraft-core/typechain-types';
import { rpcProvider } from '../utils';
import { contract } from '../constant';

export function shop2() {
  return Shop__factory.connect(contract().Shop2, rpcProvider);
}
