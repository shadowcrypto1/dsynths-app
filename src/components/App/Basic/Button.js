import styled from 'styled-components'

const Tab = styled.div`
  font-size: 15px;
  line-height: 19px;
  height: 35px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  width: 145px;

  &:hover {
    cursor: pointer;
  }
`

export const LongTab = styled(Tab)`
  border-radius: 10px 0px 0px 10px;
  ${({ selected }) =>
    selected
      ? `
    background: #00D16C;
    color: #000000;
  `
      : `
    background: rgba(206, 206, 206, 0.35);
    border: 1px solid rgba(206, 206, 206, 0.5);
    border-right: 0;
    color: #FFFFFF;
  `};
`

export const ShortTab = styled(Tab)`
  border-radius: 0px 10px 10px 0px;
  ${({ selected }) =>
    selected
      ? `
    background: rgba(255, 33, 33, 0.4);
    color: #000000;
  `
      : `
    background: rgba(206, 206, 206, 0.35);
    border: 1px solid rgba(206, 206, 206, 0.5);
    border-left: 0;
    color: #FFFFFF;
  `};
`

export const TradeButton = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 56px;
  line-height: ${(props) => props.size ?? '24px'};
  font-size: ${(props) => props.size ?? '24px'};
  align-items: center;
  text-align: center;
  color: #ffffff;
  background: ${(props) => (props.disabled ? 'rgba(255, 33, 33, 0.4)' : '#542FE6')};
  border-radius: 20px;
  &:hover {
    cursor: ${(props) => (props.disabled ? 'auto' : 'pointer')};
  }
`
