/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withStyles } from '@material-ui/core';
import React from 'react';

import { StyledMuiSliderBase } from 'in-new-components/Slider/base/StyledMuiSliderBase';
import { restrictedSliderPropTypes } from 'in-new-components/Slider/proptypes';
import { identity } from 'in-services/util/function';
import theme from 'in-themes';

const StyledMuiSlider = withStyles({
  mark: {
    backgroundImage: `url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='4px' height='2px' viewBox='0 0 4 2' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cdefs%3E%3Cpath d='M4,0 C3.44771525,0 3,0.44771525 3,1 C3,1.55228475 3.44771525,2 4,2 L4,2 L0,2 L0.116621125,1.99327227 C0.61395981,1.93550716 1,1.51283584 1,1 C1,0.44771525 0.55228475,0 0,0 L0,0 Z' id='path-1'%3E%3C/path%3E%3C/defs%3E%3Cg id='Sliders' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cmask id='mask-2' fill='white'%3E%3Cuse xlink:href='%23path-1'%3E%3C/use%3E%3C/mask%3E%3Cuse id='Form-2' fill='white' xlink:href='%23path-1'%3E%3C/use%3E%3C/g%3E%3C/svg%3E")`,
    backgroundColor: theme.lib.colors.white,
    height: 2
  }
})(StyledMuiSliderBase);

export default function RestrictedSlider(props) {
  const {
    value,
    marks,
    onChange,
    max,
    min,
    style,
    disabled = false,
    valueLabelFormat = identity,
    valueLabelDisplay = 'on'
  } = props;

  return (
    <div
      style={{
        ...style,
        width: '100%',
        minHeight: valueLabelDisplay === 'on' ? '5.5rem' : '4rem',
        padding: '0 2rem'
      }}
    >
      <StyledMuiSlider
        disabled={disabled}
        orientation="horizontal"
        value={value}
        marks={marks}
        max={max}
        min={min}
        step={null}
        onChange={(event, newValue) => {
          if (newValue !== value) onChange(newValue);
        }}
        valueLabelFormat={valueLabelFormat}
        valueLabelDisplay={valueLabelDisplay}
      />
    </div>
  );
}

RestrictedSlider.propTypes = restrictedSliderPropTypes;
