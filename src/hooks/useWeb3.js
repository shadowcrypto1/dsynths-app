import { useEffect, useState } from 'react'
import { useWeb3React as useWeb3ReactCore} from '@web3-react/core'
import { isMobile } from 'react-device-detect'

import { injected } from '../connectors'
import { NetworkContextName } from '../constants/misc'

export function useWeb3React() {
  // const context = useWeb3ReactCore()
  // const contextNetwork = useWeb3ReactCore(NetworkContextName)
  // return context.active ? context : contextNetwork

  // replace with address to impersonate
  const impersonate = false
  const context = useWeb3ReactCore()
  const contextNetwork = useWeb3ReactCore(NetworkContextName)
  return context.active
    ? { ...context, account: impersonate || context.account }
    : { ...contextNetwork, account: impersonate || contextNetwork.account }
}

export function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore()
  const [tried, setTried] = useState(false)

  useEffect(() => {
    if (isMobile && window.ethereum) return setTried(true)
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      }
      setTried(true)
    })
  }, [activate])

  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore()

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error)
        })
        // According to the Metamask documentation: We strongly recommend reloading the page on chain changes, unless you have good reason not to.
        // TODO: fix why the reloader doesn't pick up on the last pushed URL, but instead uses the very first URL of when the page was loaded
        // window.location.reload()
      }

      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error) => {
            console.error('Failed to activate after accounts changed', error)
          })
        }
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}
