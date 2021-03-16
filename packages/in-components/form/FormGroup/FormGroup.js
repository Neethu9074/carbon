/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import './FormGroup.less';

const block = 'in-form-group';

export default forwardRef(function FormGroup({ children, className, style, withoutBottomMargin }, ref) {
  return (
    <div
      className={classNames({
        [block]: true,
        [className]: className,
        [`${block}--without-bottom-margin`]: withoutBottomMargin
      })}
      style={style}
      ref={ref}
    >
      {children}
    </div>
  );
});
