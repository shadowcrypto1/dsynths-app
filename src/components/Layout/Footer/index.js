import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0;
  font-size: var(--fontsize-text);
`

const Link = styled.a`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: underline;
  }

  &:before {
    content: " ";
    white-space: pre;
  }
`

export const Footer = () => {
	return (
		<Wrapper>
      © {`${new Date().getFullYear()}`} a product of
			<Link target="_blank" rel="noopener noreferrer" href="https://github.com/dsynths">
        dsynths
			</Link>
		</Wrapper>
	)
}
