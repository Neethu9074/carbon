import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import locals from './Label.mless';

export default function Label({ hasError, className, ...labelProps }) {
  return (
    <label
      className={classNames(locals.label, className, {
        [locals.hasError]: hasError
      })}
      {...labelProps}
    />
  );
}

Label.propTypes = {
  className: PropTypes.string,
  hasError: PropTypes.bool,
  withoutMargin: PropTypes.bool
};
