/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import useThemedLocals from 'in-hooks/useThemedLocals';
import Tooltip from 'in-components/Tooltip';

import styleDefs from './InputValueViewerReadOnly.mless';

export default function InputValueViewerReadOnly({ value = '', className }) {
  const locals = useThemedLocals(styleDefs);
  value = String(value);

  return (
    <Tooltip content={<span>{value}</span>} overflowEllipsis>
      <div
        className={classNames({
          [locals.inputValueViewer_disablehover]: true,
          className
        })}
      >
        {value}
      </div>
    </Tooltip>
  );
}
