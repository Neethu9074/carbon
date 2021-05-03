/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { Th } from 'in-components/tables/sharedComponents/Table';

import locals from './SortableTh.mless';

export default function SortableTh({
  isSortedByThisColumn,
  sortDirection,
  onClick,
  children,
  className,
  wrapContent,
  rightAligned,
  noWrap,
  width,
  widthInAbsoluteUnit
}) {
  return (
    <Th
      className={classNames({
        [className]: className,
        [locals.rightAligned]: rightAligned
      })}
      noWrap={noWrap}
      width={width}
      widthInAbsoluteUnit={widthInAbsoluteUnit}
      wrapContent={wrapContent}
    >
      <a
        href=""
        className={classNames({
          [locals.column]: true,
          [locals.rightAlignedLink]: rightAligned,
          [locals.activeColumn]: isSortedByThisColumn
        })}
        onClick={onClick}
      >
        {children}
        {isSortedByThisColumn && (
          <SvgIcon
            className={locals.icon}
            type={sortDirection === 'ASC' ? 'lib_arrow_short_up' : 'lib_arrow_short_down'}
            size="xs"
          />
        )}

        {!isSortedByThisColumn && <SvgIcon className={locals.ghostIcon} type="lib_arrow_short_down" size="xs" />}
      </a>
    </Th>
  );
}
