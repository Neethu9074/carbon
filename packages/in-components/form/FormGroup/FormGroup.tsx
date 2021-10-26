/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement, ReactNode, forwardRef, CSSProperties } from 'react';
import classNames from 'classnames';

import './FormGroup.less';

const block = 'in-form-group';

export interface Props {
  children: ReactNode | ReactElement;
  className?: string;
  style?: CSSProperties;
  withoutBottomMargin?: boolean;
}

export default forwardRef<HTMLDivElement, Props>(function FormGroup(
  { children, className, style, withoutBottomMargin }: Props,
  ref
) {
  return (
    <div
      className={classNames(block, className, {
        [`${block}--without-bottom-margin`]: withoutBottomMargin
      })}
      style={style}
      ref={ref}
    >
      {children}
    </div>
  );
});
