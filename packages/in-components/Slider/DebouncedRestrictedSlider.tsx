/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { RestrictedSlider } from '@instana/components';

import { RestrictedSliderProp } from 'in-components/Slider/proptypes';
import useDebouncedValue from 'in-hooks/useDebouncedValue';

export default function DebouncedRestrictedSlider(props: RestrictedSliderProp) {
  const result = useDebouncedValue(props.value, props.onChange, 500);
  return (
    <RestrictedSlider {...props} value={result.value} onChange={(_event, value) => result.onChange(value as number)} />
  );
}
