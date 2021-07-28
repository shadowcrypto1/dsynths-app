import { debounce } from 'lodash'
import { useEffect, useCallback, useState } from 'react'

import { useBaseState } from '../state/base/hooks'
import { useActionState } from '../state/action/hooks'

export const useAmountManager = (price, type, fee) => {
  const { symbol } = useBaseState()
  const action = useActionState()

  const [ isMounted, setIsMounted ] = useState(false)
  const [ currentSymbol, setCurrentSymbol ] = useState(symbol)
  const [ inputAmount, setInputAmount ] = useState('')
  const [ outputAmount, setOutputAmount ] = useState('')

  useEffect(() => setIsMounted(true), [])

  useEffect(() => {
    if (!isMounted) return
    if (symbol !== currentSymbol) {
      // console.log(`${type}: Symbol has changed to ${symbol}, resetting inputFields`);
      setInputAmount('')
      setOutputAmount('')
      setCurrentSymbol(symbol)
    } else {
      // console.log(`${type}: Price has changed, updating outputAmount`);
      handleInput(inputAmount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, price])

  useEffect(() => {
    if (!isMounted) return
    // console.log(`${type}: Changing action to ${action}, switching inputFields`);
    const tempInput = inputAmount
    setInputAmount(outputAmount)
    setOutputAmount(tempInput)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action])

  const debounceInput = useCallback(
    debounce(amount => {
      if (!amount) return setOutputAmount('')
      setOutputAmount(type === 'LONG'
        ? action === 'OPEN'
          ? (amount / price) * (1 - fee)
          : (amount * price) * (1 - fee)
        : action === 'CLOSE'
          ? amount * price * (1 - fee)
          : amount / price * (1 - fee)
      )
    }, 300),
    [price, type, fee, action]
  )

  const debounceOutput = useCallback(
    debounce(amount => {
      if (!amount) return setInputAmount('')
      setInputAmount(type === 'LONG'
        ? action === 'OPEN'
          ? amount * price * (1 - fee)
          : amount / price * (1 - fee)
        : action === 'CLOSE'
          ? amount / price * (1 - fee)
          : amount * price * (1 - fee)
      )
    }, 300),
    [price, type, fee, action]
  )

  const handleInput = (amount) => {
    // console.log(`${type}: Input amount has changed`);
    setInputAmount(amount)
    debounceInput((!price || !amount)
      ? ''
      : amount
    )
  }

  const handleOutput = (amount) => {
    // console.log(`${type}: Output amount has changed`);
    setOutputAmount(amount)
    debounceOutput((!price || !amount)
      ? ''
      : amount
    )
  }

  return {
    inputAmount,
    outputAmount,
    setInputAmount: handleInput,
    setOutputAmount: handleOutput,
  }
}
