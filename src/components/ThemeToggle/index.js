import React, { useContext } from "react";
import styled from 'styled-components';

import { ThemeContext } from '../../context/ThemeContext'

const themeMapping = {
  light: {
    body: '#e2e2e2',
    text: '#363537',
    toggleBorder: '#fff',
    gradient: 'linear-gradient(#39598A, #79D7ED)',
  },
  dark: {
    body: '#363537',
    text: '#FAFAFA',
    toggleBorder: '#6B8096',
    gradient: 'linear-gradient(#091236, #1E215D)',
  }
}

const ToggleContainer = styled.button`
  display: flex;
  justify-content: center;
  min-width: 40px;
  margin-right: 10px;
  background: ${({ theme }) => themeMapping[theme].gradient};
  border-radius: 30px;
  border: 2px solid ${({ theme }) => themeMapping[theme].toggleBorder};
  overflow: hidden;
  cursor: pointer;

  img {
    display: flex;
    max-width: 1rem;
    margin: auto;
    transition: all 0.3s linear;

    &:first-child {
      transform: ${({ lightTheme }) => lightTheme ? 'translateY(0)' : 'translateY(100px)'};
    }

    &:nth-child(2) {
      transform: ${({ lightTheme }) => lightTheme ? 'translateY(-100px)' : 'translateY(0)'};
    }
  }
`;

export const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const isLight = theme === 'light';

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ToggleContainer lightTheme={isLight} theme={theme} onClick={toggleTheme}>
      <img src="https://image.flaticon.com/icons/svg/1164/1164954.svg" alt="Light Mode Icon" title="Light Mode Icon"/>
      <img src="https://image.flaticon.com/icons/svg/2033/2033921.svg" alt="Dark Mode Icon" title="Dark Mode Icon"/>
    </ToggleContainer>
  );
};
