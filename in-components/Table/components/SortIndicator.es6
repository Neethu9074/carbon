import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import './SortIndicator.less';

const block = 'in-table-sort-indicator';
const activeBlock = `${block} ${block}--active`;
const iconElement = `${block}__icon`;
const invisibleIconElement = `${iconElement} ${iconElement}--hidden`;

export default function SortIndicator({ title, index, sortIndex, sortDirection, onChangeSort }) {
  const active = index === sortIndex;
  const onClick = e => {
    e.preventDefault();
    onChangeSort(index, active ? inverseDirection(sortDirection) : 'asc');
  };

  return (
    <a href="" onClick={onClick} className={active ? activeBlock : block}>
      {title}

      <SvgIcon
        className={active ? iconElement : invisibleIconElement}
        type={sortDirection === 'asc' ? 'triangle_up' : 'triangle_down'}
        width={5}
        height={5}
      />
    </a>
  );
}

function inverseDirection(direction) {
  return direction === 'asc' ? 'desc' : 'asc';
}
