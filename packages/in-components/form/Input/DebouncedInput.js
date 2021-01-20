/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import useDebouncedValue from 'in-hooks/useDebouncedValue';
import FormInput from 'in-components/form/Input/Input';
import { noop } from 'in-services/fixedObjects';

export default function DebouncedInput({
  onValueChange,
  value,
  delay,
  debounceOpts = {
    leading: true,
    trailing: true
  },
  pure = true,
  ...props
}) {
  const debounced = useDebouncedValue(value, onValueChange ?? noop, delay, debounceOpts, pure);
  return (
    <FormInput
      {...props}
      value={debounced.value}
      onChange={({ target }) => {
        debounced.onChange(target?.value);
      }}
    />
  );
}
DebouncedInput.propTypes = {
  value: PropTypes.any.isRequired,
  onValueChange: PropTypes.func.isRequired,
  debounceOpts: PropTypes.object,
  delay: PropTypes.number,
  pure: PropTypes.bool
};
