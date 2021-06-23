import React from "react";
import { Link, useLocation } from 'react-router-dom';

import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from 'react-pro-sidebar';

import { Header } from "./Header";
import Footer from "./Footer";

import { navigationMapping } from "../../../constants"

import "./index.css";

export const Sidebar = ({ toggled, handleToggleSidebar }) => {
  const location = useLocation()

  return (
    <ProSidebar
      toggled={toggled}
      onToggle={handleToggleSidebar}
      breakPoint="md" // screensize when to collapse navbar
    >
      <SidebarHeader>
        <Header />
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          {navigationMapping.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              active={location.pathname.split("/")[1] === item.route}
            >
              {item.title}
              <Link to={`/${item.route}`} />
            </MenuItem>
          ))}
        </Menu>
      </SidebarContent>

      <SidebarFooter>
        <Footer />
      </SidebarFooter>

    </ProSidebar>
  );
};
