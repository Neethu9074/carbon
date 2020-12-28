import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import locals from './Select.mless';

export default forwardRef(FormSelect);

function FormSelect({ hasError, useFullWidth, ...selectProps }, ref) {
  return (
    <div
      className={classNames({
        [locals.selectWrapper]: true,
        [locals.selectWrapperDisabled]: selectProps.disabled,
        [locals.useFullWidth]: useFullWidth
      })}
    >
      <select
        {...selectProps}
        className={classNames({
          [locals.select]: true,
          [`${locals.select}--has-error`]: hasError,
          [selectProps.className]: selectProps.className
        })}
        ref={ref}
      />
    </div>
  );
}

FormSelect.propTypes = {
  hasError: PropTypes.bool,
  useFullWidth: PropTypes.useFullWidth
};
