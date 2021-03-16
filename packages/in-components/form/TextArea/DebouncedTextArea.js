/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import FormTextArea from 'in-components/form/TextArea/TextArea';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { noop } from 'in-services/fixedObjects';

// split debouncing specific properties to avoid react-dev-tools:
// "Warning: Unknown event handler property `onValueChange`. It will be ignored."
export default function DebouncedTextArea({ onValueChange: onValueChange, value, delay, ...props }) {
  const debounced = useDebouncedValue(value, onValueChange ?? noop, delay);
  return (
    <FormTextArea
      {...props}
      value={debounced.value}
      onChange={event => {
        if (event.target) {
          debounced.onChange(event.target.value);
        }
        props.onChange?.(event);
      }}
    />
  );
}
DebouncedTextArea.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func,
  onValueChange: PropTypes.func,
  delay: PropTypes.number
};
