/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon, toInteractiveElement } from '@instana/components';

import locals from './SortIndicator.mless';

export default function SortIndicator({ title, index, sortIndex, sortDirection, onChangeSort, columnDefinition }) {
  if (columnDefinition.disableSorting) {
    return <span className={locals.tableSortIndicator}>{title}</span>;
  }

  const active = index === sortIndex;
  const onDefaultInteraction = () => {
    onChangeSort(index, active ? inverseDirection(sortDirection) : 'asc');
  };

  return (
    <div
      {...toInteractiveElement({
        onDefaultInteraction
      })}
      className={active ? locals.tableSortIndicatorActive : locals.tableSortIndicator}
    >
      {title}

      <SvgIcon
        className={active ? locals.icon : locals.iconHidden}
        type={sortDirection === 'asc' ? 'lib_arrow_short_up' : 'lib_arrow_short_down'}
        size="xs"
      />
    </div>
  );
}

function inverseDirection(direction) {
  return direction === 'asc' ? 'desc' : 'asc';
}
