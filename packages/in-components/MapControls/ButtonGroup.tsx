/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './ButtonGroup.mless';

interface Props {
  vertical?: boolean;
  className?: string;
}

export default function ButtonGroup({ vertical, children, className }: React.PropsWithChildren<Props>) {
  return (
    <div
      className={classNames({
        [locals.group]: true,
        [locals.vertical]: vertical,
        // @ts-expect-error classnames explicitly can handle undefined object keys
        [className]: className
      })}
    >
      {children}
    </div>
  );
}
