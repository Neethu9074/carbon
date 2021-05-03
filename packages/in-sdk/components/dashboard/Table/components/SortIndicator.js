/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import locals from './SortIndicator.mless';

export default function SortIndicator({ title, index, sortIndex, sortDirection, onChangeSort, columnDefinition }) {
  if (columnDefinition.disableSorting) {
    return <span className={locals.tableSortIndicator}>{title}</span>;
  }

  const active = index === sortIndex;
  const onClick = e => {
    e.preventDefault();
    onChangeSort(index, active ? inverseDirection(sortDirection) : 'asc');
  };

  return (
    <Link href="" onClick={onClick} className={active ? locals.tableSortIndicatorActive : locals.tableSortIndicator}>
      {title}

      <SvgIcon
        className={active ? locals.icon : locals.iconHidden}
        type={sortDirection === 'asc' ? 'lib_arrow_short_up' : 'lib_arrow_short_down'}
        size="xs"
      />
    </Link>
  );
}

function inverseDirection(direction) {
  return direction === 'asc' ? 'desc' : 'asc';
}
