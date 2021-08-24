import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import CookieConsentCore from "react-cookie-consent"

const BannerStyle = {
  display: 'flex',
  position: 'fixed',
  bottom: 0,
  left: 0,
  justifyContent: 'center',
  alignItems: 'center',
  background: '#FFFFFF',
  margin: '15px',
  width: 'calc(100% - 30px)',
  height: 'auto',
  borderRadius: '8px',
  padding: '12px',
}

const ContentStyle = {
  marginRight: '10px',
  color: '#000000',
  fontSize: '0.9rem',
}

const ButtonStyle = {
  minHeight: '25px',
  minWidth: '70px',
  background: '#5B40A8',
  alignText: 'center',
  outline: 'none',
  borderRadius: '6px',
  color: '#FFFFFF',
  border: 'none',
}

const Anchor = styled(Link)`
  text-decoration: none;
  color: #5B40A8;
`

export const CookieConsent = ({ onAccept }) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .btn:hover {
          cursor: pointer;
        }
      `}} />
      <CookieConsentCore
        debug={false}
        disableStyles={true}
        style={BannerStyle}
        contentStyle={ContentStyle}
        buttonStyle={ButtonStyle}
        buttonText={'Got it'}
        buttonClasses={'btn'}
        onAccept={onAccept}
      >
        This website
        <Anchor to={'/terms'} >&nbsp;uses cookies to improve your experience&nbsp;</Anchor>
        and has an
        <Anchor to={'/privacy'} >&nbsp;updated Privacy Policy.&nbsp;</Anchor>
      </CookieConsentCore>
    </>
  )
}
