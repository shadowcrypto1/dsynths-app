import styled from 'styled-components'

const Tab = styled.div`
  font-size: 15px;
  line-height: 19px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  width: 100%;

  &:hover {
    cursor: pointer;
  }
`

export const LongTab = styled(Tab)`
  background: ${({ selected }) => selected ? 'rgba(0, 209, 108, 0.15)' : 'linear-gradient(135deg, rgba(91, 204, 189, 0.14902) 0%, rgba(97, 192, 191, 0.14902) 33.33%, rgba(85, 188, 200, 0.14902) 74.49%, rgba(105, 207, 184, 0.14902) 100%)'};
  border-radius: 6px 0px 0px 6px; /* top-left top-right bottom-right bottom-left */
  border: ${({ selected }) => selected ? '1px solid #00D16C' : '1px solid rgba(255, 255, 255, 0.5)'};
  ${({ selected }) => !selected && `
    border-right: 0;
  `};
  color: ${({ selected }) => selected ? '#00D16C' : 'rgba(255, 255, 255, 0.5)'};
`

export const ShortTab = styled(Tab)`
  background: ${({ selected }) => selected ? 'rgba(255, 33, 33, 0.15)' : 'linear-gradient(135deg, rgba(91, 204, 189, 0.14902) 0%, rgba(97, 192, 191, 0.14902) 33.33%, rgba(85, 188, 200, 0.14902) 74.49%, rgba(105, 207, 184, 0.14902) 100%)'};
  border: ${({ selected }) => selected ? '1px solid #FF2121' : '1px solid rgba(255, 255, 255, 0.5)'};
  border-radius: 0px 6px 6px 0px; /* top-left top-right bottom-right bottom-left */
  ${({ selected }) => !selected && `
    border-left: 0;
  `};
  color: ${({ selected }) => selected ? '#FF2121' : 'rgba(255, 255, 255, 0.5)'};
`

export const TradeButton = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 56px;
  line-height: 56px;
  font-size: ${props => props.size ?? '24px'};
  align-items: center;
  text-align: center;
  color: #FFFFFF;
  background: ${props => props.disabled
    ? 'rgba(255, 33, 33, 0.4)'
    : 'linear-gradient(91.77deg, #DA316B -97.86%, #1175DE 97.84%)'
};
  border: 1px solid rgba(146, 119, 224, 0.5);
  border-radius: 10px;
  &:hover {
    cursor: ${props => props.disabled ? 'auto' : 'pointer'};
  }
`
