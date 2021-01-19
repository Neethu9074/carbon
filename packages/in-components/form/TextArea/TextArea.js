/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import locals from './TextArea.mless';

export default forwardRef(FormTextArea);

function FormTextArea({ hasError, hideValidityInformationOnFocus, className, ...textAreaProps }, ref) {
  return (
    <textarea
      {...textAreaProps}
      ref={ref}
      className={classNames(locals.textArea, className, {
        [locals.error]: hasError,
        [locals.hideValidityInformationOnFocus]: hideValidityInformationOnFocus
      })}
    />
  );
}

FormTextArea.propTypes = {
  className: PropTypes.className,
  hasError: PropTypes.bool,
  hideValidityInformationOnFocus: PropTypes.bool
};
