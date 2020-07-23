import React from 'react';
import PropTypes from 'prop-types';

import FormTextArea from 'in-components/form/TextArea/TextArea';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { noop } from 'in-services/fixedObjects';

export default function DebouncedTextArea(props) {
  const debounced = useDebouncedValue(props.value, props.onDebouncedChange ?? noop, props.delay);
  return (
    <FormTextArea
      {...props}
      value={debounced.value}
      onChange={event => {
        if (event.target) {
          debounced.onChange(event.target.value);
        }
        props.onChange(event);
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
