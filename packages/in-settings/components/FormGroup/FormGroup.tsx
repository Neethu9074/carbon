/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { CSSProperties } from 'react';
import classNames from 'classnames';

import './FormGroup.less';

const block = 'in-settings-form-group';

type FormGroupProps = {
  children: React.ReactNode;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  noFlex?: boolean | undefined;
};

export default function FormGroup({ children, className, style, noFlex = false }: FormGroupProps) {
  return (
    <div
      className={classNames({
        [block]: true,
        [className ?? '']: className,
        [`${block}--flex`]: !noFlex
      })}
      style={style}
    >
      {children}
    </div>
  );
}
