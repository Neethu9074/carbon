/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import locals from './TextArea.mless';

export interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  name?: string;
  value?: string;
  hasError?: boolean;
  disabled?: boolean;
  rows?: number;
  hideValidityInformationOnFocus?: boolean;
}

export default forwardRef<HTMLTextAreaElement, TextAreaProps>(function FormTextArea(
  { hasError, hideValidityInformationOnFocus, className, rows, ...textAreaProps },
  ref
) {
  return (
    <textarea
      {...textAreaProps}
      ref={ref}
      rows={rows}
      className={classNames(locals.textArea, className, {
        [locals.error]: hasError,
        [locals.hideValidityInformationOnFocus]: hideValidityInformationOnFocus
      })}
    />
  );
});
