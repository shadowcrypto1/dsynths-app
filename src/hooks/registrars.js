import { useState, useEffect } from 'react'
import { getTopRegistrars } from "../web3/apollo/controllers"

export function useTopRegistrars() {
  const [ topRegistrars, setTopRegistrars ] = useState([])

  const fetchTopRegistrars = async () => {
    try {
      let results = await getTopRegistrars(15)
      setTopRegistrars(results)
    } catch (err) {
      console.error(err)
      setTopRegistrars([])
    }
  }

  useEffect(() => {
    fetchTopRegistrars()
  }, [])

  return topRegistrars
}
