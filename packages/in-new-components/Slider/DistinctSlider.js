/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import { StyledMuiSliderBase } from 'in-new-components/Slider/base/StyledMuiSliderBase';
import { identity } from 'in-services/util/function';

const StyledMuiSlider = withStyles({
  mark: {
    background: theme.lib.colors.N500,
    borderRadius: '50%',
    marginTop: -1,
    height: 4
  }
})(StyledMuiSliderBase);

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
    valueLabelFormat = identity,
    ValueLabelComponent,
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
        ValueLabelComponent={ValueLabelComponent}
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
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    }).isRequired
  ),
  step: PropTypes.number.isRequired,
  ValueLabelComponent: PropTypes.func,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  valueLabelFormat: PropTypes.func,
  valueLabelDisplay: PropTypes.oneOf(['on', 'off', 'auto']),
  disabled: PropTypes.bool,
  style: PropTypes.any,
  value: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.array.isRequired])
};
