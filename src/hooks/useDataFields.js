import { useMemo } from 'react'

import { useBaseState } from '../state/base/hooks'
import { usePairState } from '../state/pair/hooks'
import { useActionState } from '../state/action/hooks'

export const useDataFields = (type) => {
  const base = useBaseState()
  const pair = usePairState()
  const action = useActionState()

  return useMemo(() => {
    let capType = type.toLowerCase()
    const quote = {
      long: {
        price: base.long.price,
        fee: base.long.fee,
        isClosed: base.long.isClosed || !base.long.price,
      },
      short: {
        price: base.short.price,
        fee: base.short.fee,
        isClosed: base.short.isClosed || !base.short.price,
      },
    }

    switch (action) {
    case 'OPEN':
      return {
        inputTicker: pair.symbol,
        inputSymbol: pair.symbol,
        inputContract: pair.contract,
        inputDecimals: pair.decimals,
        inputIsToken: pair.isToken,
        outputTicker: base.symbol,
        outputSymbol: base[capType].symbol,
        outputContract: base[capType].contract,
        outputDecimals: base[capType].decimals,
        outputIsToken: base[capType].isToken,
        quote,
      }
    case 'CLOSE':
      return {
        inputTicker: base.symbol,
        inputSymbol: base[capType].symbol,
        inputContract: base[capType].contract,
        inputDecimals: base[capType].decimals,
        inputIsToken: base[capType].isToken,
        outputTicker: pair.symbol,
        outputSymbol: pair.symbol,
        outputContract: pair.contract,
        outputDecimals: pair.decimals,
        outputIsToken: pair.isToken,
        quote,
      }
    default:
      throw new Error('Action is not defined')
    }
  }, [action, base, pair, type])
}
