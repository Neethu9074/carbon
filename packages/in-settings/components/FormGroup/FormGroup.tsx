/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { CSSProperties } from 'react';
import classNames from 'classnames';

import './FormGroup.less';

const block = 'in-settings-form-group';

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  noFlex?: boolean;
  ariaLabel?: string;
}

export default function FormGroup({ children, className, style, noFlex = false, ariaLabel }: FormGroupProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={classNames(block, className, {
        [`${block}--flex`]: !noFlex
      })}
      style={style}
    >
      {children}
    </div>
  );
}
