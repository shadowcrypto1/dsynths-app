import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const ThemeButton = styled.div`
  display: flex;
  height: 35px;
  line-height: 35px; /* same as height! */
  width: 100%;
  color: ${props => props.disabled ? 'white' : 'var(--font-primaryText1)'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  border-radius: 10px;
  background-color: ${props => props.disabled ? 'red' : 'var(--c-primary5)'};
  border: 1px solid var(--c-primary5); /* hack so the height doesn't change on hover */

  font-size: var(--fontsize-block);
  text-decoration: none;

  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;

  &:hover {
    text-decoration: none;
    border: 1px solid var(--c-primary4) !important;
  }

  .disabled {
    background-color: red;
  }
`

export const Button = styled.button`
  min-height: 30px;
  line-height: 30px;
  margin: 0 5px;
  width: ${props => props.width || '100px'};
  background: ${props => props.selected ? 'var(--c-secondary1)' : 'var(--c-bg1)'};
  border: 1px solid var(--c-bg3);
  border-radius: 5px;
  text-align: center;
  color: ${props => props.selected ? 'var(--font-text1)' : 'var(--font-primaryText1)'};

  &:hover {
    cursor: pointer;
  }
`

export const LinkButton = styled(Link)`
  min-height: 30px;
  line-height: 30px;
  margin: 0 5px;
  width: ${props => props.width || '80px'};
  background: ${props => props.selected ? 'var(--c-secondary1)' : 'var(--c-bg1)'};
  border: 1px solid var(--c-bg3);
  border-radius: 5px;
  text-align: center;
  text-decoration: none;
  color: ${props => props.selected ? 'var(--font-text1)' : 'var(--font-primaryText1)'};

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`
