import MuiSlider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import theme from 'in-themes';

const StyledMuiSlider = withStyles({
  root: {
    color: theme.lib.colors.teal800
  },
  mark: {
    backgroundImage: `url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='4px' height='2px' viewBox='0 0 4 2' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cdefs%3E%3Cpath d='M4,0 C3.44771525,0 3,0.44771525 3,1 C3,1.55228475 3.44771525,2 4,2 L4,2 L0,2 L0.116621125,1.99327227 C0.61395981,1.93550716 1,1.51283584 1,1 C1,0.44771525 0.55228475,0 0,0 L0,0 Z' id='path-1'%3E%3C/path%3E%3C/defs%3E%3Cg id='Sliders' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cmask id='mask-2' fill='white'%3E%3Cuse xlink:href='%23path-1'%3E%3C/use%3E%3C/mask%3E%3Cuse id='Form-2' fill='white' xlink:href='%23path-1'%3E%3C/use%3E%3C/g%3E%3C/svg%3E")`,
    backgroundColor: 'transparent',
    width: 4,
    height: 2,
    marginLeft: -2
  },
  track: {
    height: 2
  },
  rail: {
    height: 2,
    opacity: 0.5
  }
})(MuiSlider);

export default function DistinctSlider(props) {
  const { value, onChange, step, max, min, style } = props;

  return (
    <div
      style={{
        ...style,
        width: '100%',
        padding: '0 32px'
      }}
    >
      <StyledMuiSlider
        orientation={'horizontal'}
        value={value}
        max={max}
        min={min}
        step={step}
        onChange={(event, value) => {
          onChange(value);
        }}
        valueLabelDisplay={'off' /* TODO switch to 'auto', when tooltip is designed... */}
      />
    </div>
  );
}

DistinctSlider.propTypes = {
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  style: PropTypes.any,
  value: PropTypes.number.isRequired
};
