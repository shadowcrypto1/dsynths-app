import gql from 'graphql-tag'

export const TRANSACTIONS_MARKET = gql`
  query transactions($symbol: [String]!, $maxResults: Int!) {
    transactions(
      where: { registrarSymbol_in: $symbol },
      orderBy: timestamp,
      orderDirection: desc,
      first: $maxResults
    ) {
      id
      block
      timestamp
      method
      from
      registrarAddress
      registrarAmount
      registrarName
      registrarSymbol
      collateralAmount
      feeAmount
    }
  }
`

export const TRANSACTIONS_ACCOUNT = gql`
  query transactions($symbol: [String]!, $maxResults: Int!, $account: Bytes!) {
    transactions(
      where: {
        from: $account,
        registrarSymbol_in: $symbol,
      },
      orderBy: timestamp,
      orderDirection: desc,
      first: $maxResults
    ) {
      id
      block
      timestamp
      method
      from
      registrarAddress
      registrarAmount
      registrarName
      registrarSymbol
      collateralAmount
      feeAmount
    }
  }
`

export const REGISTRARS = gql`
  query registrars($symbol: [String]!) {
    registrars(
      where: { symbol_in: $symbol },
    ) {
      id
      name
      symbol
      totalVolumeRegistrar
      totalVolumeDAI
      totalFeesDAI
      txCount
    }
  }
`

export const ALL_REGISTRARS = gql`
  query registrars($maxResults: Int!) {
    registrars(
      orderBy: totalVolumeDAI,
      orderDirection:desc,
      first: $maxResults
    ) {
      id
      name
      symbol
      totalVolumeRegistrar
      totalVolumeDAI
      totalFeesDAI
      txCount
    }
  }
`
