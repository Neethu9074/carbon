/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { RestrictedSlider as BaseSlider } from '@instana/components';

import { restrictedSliderPropTypes } from 'in-components/Slider/proptypes';
import { identity } from 'in-services/util/function';

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
      <BaseSlider
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
