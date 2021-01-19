/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import locals from './HorizontalFormGroup.mless';

export default function HorizontalFormGroup({ className, withoutBottomMargin, label, formElement }) {
  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [locals.withoutBottomMargin]: withoutBottomMargin,
        [className]: className
      })}
    >
      {formElement}
      {label}
    </div>
  );
}
