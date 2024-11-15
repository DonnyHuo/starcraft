import { SCF__factory } from 'starcraft-core/typechain-types';
import { rpcProvider } from '../utils';
import { token } from '../constant';

export function scf() {
  return SCF__factory.connect(token().SCF, rpcProvider);
}