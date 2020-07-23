import React from 'react';
import PropTypes from 'prop-types';

import FormTextArea from 'in-components/form/TextArea/TextArea';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { noop } from 'in-services/fixedObjects';

// split debouncing specific properties to avoid react-dev-tools:
// "Warning: Unknown event handler property `onDebouncedChange`. It will be ignored."
export default function DebouncedTextArea({ onDebouncedChange, value, delay, ...props }) {
  const debounced = useDebouncedValue(value, onDebouncedChange ?? noop, delay);
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
  onDebouncedChange: PropTypes.func,
  delay: PropTypes.number
};
