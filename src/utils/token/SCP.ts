import { SCP__factory } from 'starcraft-core/typechain-types';
import { rpcProvider } from '../utils';
import { token } from '../constant';

export function scp() {
  return SCP__factory.connect(token().SCP, rpcProvider);
}