/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

//@ts-expect-error will convert DebouncedDistinctSlider to typescript
import DebouncedDistinctSlider from 'in-components/Slider/DebouncedDistinctSlider';
import { Shape } from 'in-components/Slider/proptypes';
import { minutes } from 'in-services/time';

const marks: Shape[] = [1, 4, 7, 10].map(min => ({
  value: min,
  label: getDisplayLabel(min),
  millis: minutes.toMillis(min)
}));

function getDisplayLabel(value: number) {
  if (value == 1) {
    return '1';
  } else if (value) {
    return `${value}`;
  } else {
    return '';
  }
}

export function displayRetryIntervalSlider(
  retryIntervalField: Field<number>,
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void
) {
  return (
    <DebouncedDistinctSlider
      marks={marks}
      max={marks[marks.length - 1].value}
      min={1}
      step={1}
      value={retryIntervalField?.value}
      valueLabelDisplay="auto"
      onChange={(value: number) => {
        updateForm(
          form.updateIn(['configuration', 'retryInterval'], (field: Item) =>
            (field as Field<number>).setValue(value).setTouched(true)
          )
        );
      }}
    />
  );
}
