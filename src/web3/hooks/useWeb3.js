import React, { useEffect, useState, useRef } from 'react'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'

const RPC_URL = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 })
const web3NoAccount = new Web3(httpProvider)

export function useWeb3 () {
  const { library } = useWeb3React()
  const ref = useRef(library)
  const [ web3, setWeb3 ] = useState(library ? new Web3(library) : web3NoAccount)

  useEffect(() => {
    if (library !== ref.current) {
      setWeb3(library ? new Web3(library) : web3NoAccount)
      ref.current = library
    }
  }, [library])

  return web3
}
