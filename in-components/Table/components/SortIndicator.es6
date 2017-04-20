import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import './SortIndicator.less';

const block = 'in-table-sort-indicator';
const activeBlock = `${block} ${block}--active`;
const iconElement = `${block}__icon`;

export default function SortIndicator({ title, index, sortIndex, sortDirection, onChangeSort }) {
  const active = index === sortIndex;
  const onClick = e => {
    e.preventDefault();
    onChangeSort(index, active ? inverseDirection(sortDirection) : 'asc');
  };

  return (
    <a href="" onClick={onClick} className={active ? activeBlock : block}>
      {title}

      {active
        ? <SvgIcon
            className={iconElement}
            type={sortDirection === 'asc' ? 'triangle_up' : 'triangle_down'}
            width={5}
            height={5}
          />
        : null}
    </a>
  );
}

function inverseDirection(direction) {
  return direction === 'asc' ? 'desc' : 'asc';
}
