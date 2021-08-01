import React from 'react'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledSVG = styled.svg`
  animation: 3s ${rotate} linear infinite;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  path {
    stroke: white;
  }
`

export default function LogoAsLoader({ size = '16px', stroke, ...rest}) {
  return (
    <StyledSVG width="34" height="34" viewBox="0 0 34 34" size={size} stroke={stroke} {...rest}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.0859354 15.0464C0.0859354 15.0891 0.0644531 15.1531 0.0644531 15.1958C0.0644531 15.1531 0.0644531 15.0891 0.0859354 15.0464Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M2.04081 24.8852C1.86896 24.5864 1.71858 24.2663 1.54672 23.9675C3.95274 29.111 8.91514 32.8459 14.8013 33.5929C15.0806 33.6356 15.3598 33.6569 15.6606 33.6782H15.6821C15.811 33.6782 15.9613 33.6996 16.0902 33.6996C16.3695 33.7209 16.6488 33.7209 16.9495 33.7209H16.971C17.2503 33.7209 17.5295 33.7209 17.8303 33.6996C17.9592 33.6996 18.1096 33.6782 18.2385 33.6782H18.2599C18.5392 33.6569 18.84 33.6356 19.1192 33.5929C24.6402 32.8886 29.3448 29.5592 31.8797 24.9065C33.1901 22.5162 33.9205 19.7844 33.9205 16.8818C33.9205 13.9792 33.1901 11.2261 31.8797 8.83574C29.3233 4.16176 24.6402 0.832352 19.1192 0.128054C18.84 0.0853695 18.5607 0.0640271 18.2599 0.0426847H18.2385C18.1096 0.0426847 17.9592 0.0213424 17.8303 0.0213424C17.5295 0 17.2503 0 16.971 0H16.9495C16.6702 0 16.3695 0 16.0902 0.0213424C15.9613 0.0213424 15.811 0.0426847 15.6821 0.0426847H15.6606C15.3813 0.0640271 15.0806 0.0853695 14.8013 0.128054C8.91514 0.875037 3.97422 4.60995 1.5682 9.75346C1.71858 9.43332 1.89044 9.13453 2.0623 8.8144C4.25349 4.97277 7.94844 2.45437 12.1375 2.45437C13.8561 2.45437 15.5102 2.88122 16.9925 3.64954C21.2889 5.86915 24.275 10.9486 24.275 16.8605C24.275 22.7723 21.2675 27.8518 16.9925 30.0714C15.5102 30.8397 13.8776 31.2666 12.1375 31.2666C7.92696 31.2666 4.23201 28.7482 2.04081 24.8852Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.0214823 15.8574C0.0214823 15.9214 0.0214823 15.9855 0 16.0495C0 15.9855 0 15.9214 0.0214823 15.8574Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.0214823 17.8637C0.0214823 17.7997 0.0214823 17.7357 0 17.6716C0 17.7357 0 17.7997 0.0214823 17.8637Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.0859354 18.6745C0.0859354 18.6319 0.0644531 18.5678 0.0644531 18.5251C0.0644531 18.5678 0.0644531 18.6319 0.0859354 18.6745Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 16.8604C0 19.763 0.75188 22.5162 2.04082 24.8852C4.23201 28.7268 7.92696 31.2452 12.116 31.2452C13.8346 31.2452 15.4887 30.8183 16.971 30.05C12.6745 27.8518 9.66703 22.7723 9.66703 16.8604C9.66703 10.9486 12.6745 5.86912 16.971 3.64952C15.4887 2.88119 13.8561 2.45435 12.116 2.45435C7.92696 2.45435 4.23201 4.97274 2.04082 8.81437C0.75188 11.2047 0 13.9579 0 16.8604Z" fill="url(#paint0_linear)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.0859354 15.0464C0.0859354 15.0891 0.0644531 15.1531 0.0644531 15.1958C0.0644531 15.1531 0.0644531 15.0891 0.0859354 15.0464Z" fill="url(#paint1_linear)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M2.04081 24.8852C1.86896 24.5864 1.71858 24.2663 1.54672 23.9675C3.95274 29.111 8.91514 32.8459 14.8013 33.5929C15.0806 33.6356 15.3598 33.6569 15.6606 33.6782H15.6821C15.811 33.6782 15.9613 33.6996 16.0902 33.6996C16.3695 33.7209 16.6488 33.7209 16.9495 33.7209H16.971C17.2503 33.7209 17.5295 33.7209 17.8303 33.6996C17.9592 33.6996 18.1096 33.6782 18.2385 33.6782H18.2599C18.5392 33.6569 18.84 33.6356 19.1192 33.5929C24.6402 32.8886 29.3448 29.5592 31.8797 24.9065C33.1901 22.5162 33.9205 19.7844 33.9205 16.8818C33.9205 13.9792 33.1901 11.2261 31.8797 8.83574C29.3233 4.16176 24.6402 0.832352 19.1192 0.128054C18.84 0.0853695 18.5607 0.0640271 18.2599 0.0426847H18.2385C18.1096 0.0426847 17.9592 0.0213424 17.8303 0.0213424C17.5295 0 17.2503 0 16.971 0H16.9495C16.6702 0 16.3695 0 16.0902 0.0213424C15.9613 0.0213424 15.811 0.0426847 15.6821 0.0426847H15.6606C15.3813 0.0640271 15.0806 0.0853695 14.8013 0.128054C8.91514 0.875037 3.97422 4.60995 1.5682 9.75346C1.71858 9.43332 1.89044 9.13453 2.0623 8.8144C4.25349 4.97277 7.94844 2.45437 12.1375 2.45437C13.8561 2.45437 15.5102 2.88122 16.9925 3.64954C21.2889 5.86915 24.275 10.9486 24.275 16.8605C24.275 22.7723 21.2675 27.8518 16.9925 30.0714C15.5102 30.8397 13.8776 31.2666 12.1375 31.2666C7.92696 31.2666 4.23201 28.7482 2.04081 24.8852Z" fill="url(#paint2_linear)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.0214823 15.8574C0.0214823 15.9214 0.0214823 15.9855 0 16.0495C0 15.9855 0 15.9214 0.0214823 15.8574Z" fill="url(#paint3_linear)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.0214823 17.8637C0.0214823 17.7997 0.0214823 17.7357 0 17.6716C0 17.7357 0 17.7997 0.0214823 17.8637Z" fill="url(#paint4_linear)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.0859354 18.6745C0.0859354 18.6319 0.0644531 18.5678 0.0644531 18.5251C0.0644531 18.5678 0.0644531 18.6319 0.0859354 18.6745Z" fill="url(#paint5_linear)"/>
      <defs>
        <linearGradient id="paint0_linear" x1="16.9603" y1="16.8604" x2="0" y2="16.8604" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9754AE"/>
          <stop offset="0.09192" stopColor="#8B54AC"/>
          <stop offset="0.7169" stopColor="#3E539B"/>
          <stop offset="1" stopColor="#265595"/>
        </linearGradient>
        <linearGradient id="paint1_linear" x1="0.0958173" y1="15.1149" x2="0.036091" y2="15.132" gradientUnits="userSpaceOnUse">
          <stop offset="0.0989583" stopColor="#41942B" stopOpacity="0.31"/>
          <stop offset="0.6302" stopColor="#4AB1EC"/>
          <stop offset="1" stopColor="#70EAE2" stopOpacity="0.76"/>
        </linearGradient>
        <linearGradient id="paint2_linear" x1="2.16808" y1="21.0382" x2="36.8514" y2="11.1086" gradientUnits="userSpaceOnUse">
          <stop offset="0.0989583" stopColor="#41942B" stopOpacity="0.31"/>
          <stop offset="0.6302" stopColor="#4AB1EC"/>
          <stop offset="1" stopColor="#70EAE2" stopOpacity="0.76"/>
        </linearGradient>
        <linearGradient id="paint3_linear" x1="0.0346294" y1="15.9359" x2="-0.0317499" y2="15.9549" gradientUnits="userSpaceOnUse">
          <stop offset="0.0989583" stopColor="#41942B" stopOpacity="0.31"/>
          <stop offset="0.6302" stopColor="#4AB1EC"/>
          <stop offset="1" stopColor="#70EAE2" stopOpacity="0.76"/>
        </linearGradient>
        <linearGradient id="paint4_linear" x1="0.0242105" y1="17.7721" x2="-0.0178963" y2="17.7841" gradientUnits="userSpaceOnUse">
          <stop offset="0.0989583" stopColor="#41942B" stopOpacity="0.31"/>
          <stop offset="0.6302" stopColor="#4AB1EC"/>
          <stop offset="1" stopColor="#70EAE2" stopOpacity="0.76"/>
        </linearGradient>
        <linearGradient id="paint5_linear" x1="0.0818753" y1="18.5955" x2="0.0546627" y2="18.6033" gradientUnits="userSpaceOnUse">
          <stop offset="0.0989583" stopColor="#41942B" stopOpacity="0.31"/>
          <stop offset="0.6302" stopColor="#4AB1EC"/>
          <stop offset="1" stopColor="#70EAE2" stopOpacity="0.76"/>
        </linearGradient>
      </defs>
    </StyledSVG>
  )
}
