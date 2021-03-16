/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DistinctSlider from 'in-new-components/Slider/DistinctSlider';
import useDebouncedValue from 'in-hooks/useDebouncedValue';

export default function DebouncedDistinctSlider(props) {
  const result = useDebouncedValue(props.value, props.onChange, 500, { maxWait: props.debounceMaxWait ?? 1000 });
  return <DistinctSlider {...props} value={result.value} onChange={result.onChange} />;
}
