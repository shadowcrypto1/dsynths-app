import React from 'react'
import styled from 'styled-components'
import { Slider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const Wrapper = styled.div`
  display: flex;
`

const CustomSlider = withStyles({
  root: {
    color: 'gray',
    margin: '7px',
  },
  thumb: {
    height: 15,
    width: 15,
    backgroundColor: "white",
    border: "3px solid black",
    "&:focus, &:hover": {
      boxShadow: "0px 0px 0px 8px rgba(84, 199, 97, 0.05)"
    },
    "&$active": {
      boxShadow: "0px 0px 0px 12px rgba(84, 199, 97, 0.05)"
    }
  },
  track: {
    color: "#5551FF50",
    height: 4,
    borderRadius: 4
  },
  rail: {
    color: "#5551FF30",
    height: 8,
    borderRadius: 4
  },
})(Slider)

export default function SliderComponent ({ onChange }) {
  const onChangeCommitted = (evt, value) => {
    return onChange(value)
  }
  return (
    <Wrapper>
      <CustomSlider
        defaultValue={0}
        onChangeCommitted={onChangeCommitted}
        valueLabelDisplay={"off"}
        step={25}
        marks={[25, 50, 75, 100]}
        min={0}
        max={100}
      />
    </Wrapper>
  )
}
