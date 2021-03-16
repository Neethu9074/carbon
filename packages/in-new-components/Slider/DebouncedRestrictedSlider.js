/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { restrictedSliderPropTypes } from 'in-new-components/Slider/proptypes';
import RestrictedSlider from 'in-new-components/Slider/RestrictedSlider';
import useDebouncedValue from 'in-hooks/useDebouncedValue';

export default function DebouncedRestrictedSlider(props) {
  const result = useDebouncedValue(props.value, props.onChange, 500);
  return <RestrictedSlider {...props} value={result.value} onChange={result.onChange} />;
}

DebouncedRestrictedSlider.propTypes = restrictedSliderPropTypes;
