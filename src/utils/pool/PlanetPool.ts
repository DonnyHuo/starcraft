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
    orderDirection: string,
    user?: string,
    block?: number,
  ) => {
    const harvestInfosQuery = `
      query($first: Int, $skip: Int, $orderDirection: String, $user: String, $block: Int) {
        harvests(
          first: $first, skip: $skip, orderDirection: $orderDirection, ${block ? `block: { number: $block },` : ``}
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
        user: "0x07c549cce36667fe11153c272d292039b9ffb2ba",
        block: block,
      },
    });
  },
}