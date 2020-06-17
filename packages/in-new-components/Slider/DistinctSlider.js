import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import { StyledMuiSliderBase } from 'in-new-components/Slider/base/StyledMuiSliderBase';
import theme from 'in-themes';

const StyledMuiSlider = withStyles({
  mark: {
    background: theme.lib.colors.N500,
    borderRadius: '50%',
    marginTop: -1,
    height: 4
  }
})(StyledMuiSliderBase);

const Identity = x => x;

export default function DistinctSlider(props) {
  const {
    value,
    marks,
    onChange,
    step,
    max,
    min,
    style,
    disabled = false,
    valueLabelFormat = Identity,
    valueLabelDisplay = 'on'
  } = props;

  return (
    <div
      style={{
        ...style,
        width: '100%',
        minHeight: '4rem', // 64 without value label on hovering
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
        step={step}
        onChange={(event, newValue) => {
          if (newValue !== value) onChange(newValue);
        }}
        valueLabelFormat={valueLabelFormat}
        valueLabelDisplay={valueLabelDisplay}
      />
    </div>
  );
}

DistinctSlider.propTypes = {
  marks: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string
    }).isRequired
  ),
  step: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  valueLabelFormat: PropTypes.func,
  valueLabelDisplay: PropTypes.oneOf(['on', 'off', 'auto']),
  disabled: PropTypes.bool,
  style: PropTypes.any,
  value: PropTypes.number.isRequired
};
