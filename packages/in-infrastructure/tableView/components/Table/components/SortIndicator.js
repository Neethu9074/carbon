/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon, toInteractiveElement } from '@instana/components';

import './SortIndicator.less';

const block = 'in-table-sort-indicator';
const activeBlock = `${block} ${block}--active`;
const iconElement = `${block}__icon`;
const invisibleIconElement = `${iconElement} ${iconElement}--hidden`;

export default function SortIndicator({ title, index, sortIndex, sortDirection, onChangeSort, columnDefinition }) {
  if (columnDefinition.disableSorting) {
    return <span className={block}>{title}</span>;
  }

  const active = index === sortIndex;
  const onClick = () => {
    onChangeSort(index, active ? inverseDirection(sortDirection) : 'asc');
  };

  return (
    <div
      {...toInteractiveElement({
        preventDefault: true,
        onDefaultInteraction: onClick
      })}
      className={active ? activeBlock : block}
    >
      {title}

      <SvgIcon
        className={active ? iconElement : invisibleIconElement}
        type={sortDirection === 'asc' ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
        size="xs"
      />
    </div>
  );
}

function inverseDirection(direction) {
  return direction === 'asc' ? 'desc' : 'asc';
}
