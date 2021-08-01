import React from 'react'
import styled from 'styled-components'

import PopupItem from './PopupItem'
import { useActivePopups } from '../../state/application/hooks'
import { useWindowSize } from '../../hooks/useWindowSize'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: fixed;
  height: auto;
  bottom: 40px;
  z-index: 99999;
`

const ContainerLarge = styled(Container)`
  right: 30px;
  width: 400px;
`

const ContainerSmall = styled(Container)`
  margin-left: 50%;
  transform: translateX(-50%);
  width: 90vw;
`

export default function Popups() {
  const activePopups = useActivePopups()
  const { width } = useWindowSize()

  return (
    <>
      {width >= 810 ? (
        <ContainerLarge size={width}>
          {activePopups.map((item) => {
            return (
              <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
            )
          })}
        </ContainerLarge>
      ) : (
        <ContainerSmall>
          {activePopups // reverse so new items up front
            .slice(0)
            .reverse()
            .map((item) => (
              <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
            ))}
        </ContainerSmall>
      )}
    </>
  )
}
