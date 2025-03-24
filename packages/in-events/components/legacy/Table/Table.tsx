/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { TrProps, TdProps } from 'in-events/components/legacy/Table/types';

import locals from 'in-events/components/legacy/Table/Table.mless';

export function Td({ noWrap, ellipsis, active, useMinimumAmountOfHorizontalSpace, ...props }: TdProps) {
  const style = props.style ? { ...props.style } : {};
  if (ellipsis && typeof ellipsis !== 'boolean') {
    style.maxWidth = ellipsis;
  }
  return (
    <td
      {...props}
      style={style}
      className={classNames(props.className, locals.tableTd, {
        [locals.tableTdNoWrap]: noWrap,
        [locals.tableTdEllipsis]: ellipsis,
        [locals.tableTdActive]: active,
        [locals.tableUseMinimumHorizontalSpace]: useMinimumAmountOfHorizontalSpace
      })}
    />
  );
}

export function Tr({ active, selected, dull, ...trProps }: TrProps) {
  const size = trProps.size ?? 'regular';
  return (
    <tr
      {...trProps}
      className={classNames(
        trProps.className,
        locals[`tableRowDepth${trProps.depth || 1}`],
        locals.tableRow,
        locals[`tableRow${size.charAt(0).toUpperCase() + size.slice(1)}`],
        {
          [locals.tableRowClickable]: trProps.onClick,
          [locals.tableRowActive]: active,
          [locals.tableRowDull]: dull,
          [locals.tableRowSelected]: selected
        }
      )}
    />
  );
}
