import React, { useState } from 'react';
import styled from "styled-components";

import { Sidebar } from './Sidebar';
import { Main } from './Main';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
`

export const Layout = ({ children }) => {
  const [toggled, setToggled] = useState(false);

  // Open/close sidebar
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <Wrapper>
      <Sidebar
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
      />
      <Main
        handleToggleSidebar={handleToggleSidebar}
      >
        {children}
      </Main >
    </Wrapper>
  );
}
