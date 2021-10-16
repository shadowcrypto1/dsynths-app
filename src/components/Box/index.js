import styled from 'styled-components'

export const NetworkBox = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  max-width: 180px;
  height: 30px;
  background: rgba(91, 96, 204, 0.15);
  border-radius: 6px;
  font-size: 10px;
  line-height: 10px;
  align-items: center;
  text-align: left;
  color: #FFFFFF;
  pointer-events: none;
  padding: 0 10px;

  & > * {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }
`
