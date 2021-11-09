import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export const uniswapV2Client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const deusV1Client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/dsynths/deus-v1',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})
