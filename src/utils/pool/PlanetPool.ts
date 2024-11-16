import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { PlanetPool__factory } from 'starcraft-core/typechain-types';
import { rpcProvider } from '../utils';
import { contract } from '../constant';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/84515/planet-pool/version/latest',
  cache: new InMemoryCache(),
})

export function planetPool() {
  return PlanetPool__factory.connect(contract().PlanetPool, rpcProvider);
}

export const planetPoolInfo = {
  getHarvestInfos: async (
    first: number,
    skip: number,
    orderBy: String,
    orderDirection: string,
    user?: string,
    block?: number,
  ) => {
    const harvestInfosQuery = `
      query($first: Int, $skip: Int, $orderBy: String, $orderDirection: String, $user: String, $block: Int) {
        harvests(
          first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, ${block ? `block: { number: $block },` : ``}
          where: {${user ? `user: $user,` : ``}}
        ) {
          blockTimestamp
          transactionHash
          user
          amounts
        }
      }
    `;

    return await client.query({
      query: gql(harvestInfosQuery),
      variables: {
        first: first,
        skip: skip,
        orderDirection: orderDirection,
        orderBy: orderBy,
        user: user,
        block: block,
      },
    });
  },
}