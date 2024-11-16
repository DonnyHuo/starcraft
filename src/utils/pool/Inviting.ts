import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Inviting__factory } from "starcraft-core/typechain-types";
import { rpcProvider } from "../utils";
import { contract } from "../constant";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/84515/planet-pool/version/latest",
  cache: new InMemoryCache(),
});

export function inviting() {
  return Inviting__factory.connect(contract().Inviting, rpcProvider);
}

export const invitingInfo = {
  getBindInfos: async (
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string,
    inviter?: string,
    user?: string
  ) => {
    const bindInfosQuery = `
      query($first: Int, $skip: Int, $orderBy: String, $orderDirection: String, $inviter: String, $user: String) {
        relationShipRecords(
          first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection,
          where: { or: [{ self: $user }, { address: $user }] } 
        ) {
          id
          self
          address
          type
          txid
        }
      }
    `;

    return await client.query({
      query: gql(bindInfosQuery),
      variables: {
        first: first,
        skip: skip,
        orderBy: orderBy,
        orderDirection: orderDirection,
        inviter: inviter,
        user: user,
      },
    });
  },

  getCounters: async (
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string,
    inviter?: string
  ) => {

    const countersQuery = `
      query($first: Int, $skip: Int, $orderBy: BigInt, $orderDirection: String, $inviter: String) {
        invitingUser(id: $inviter) {
          id
          address
          upper
          directFriends
          indirectFriends
          bindTxid
        }
      }
      `;

    return await client.query({
      query: gql(countersQuery),
      variables: {
        first: first,
        skip: skip,
        orderBy: orderBy,
        orderDirection: orderDirection,
        inviter: inviter,
      },
    });
  },
};
