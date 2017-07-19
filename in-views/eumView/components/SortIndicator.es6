import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import './SortIndicator.less';

const block = 'in-website-table-sort-indicator';
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
    <Link href="" onClick={onClick} className={active ? activeBlock : block}>
      {title}

      <SvgIcon
        className={active ? iconElement : invisibleIconElement}
        type={sortDirection === 'asc' ? 'arrow_up_straight' : 'arrow_down_straight'}
        width={12}
        height={12}
      />
    </Link>
  );
}

function inverseDirection(direction) {
  return direction === 'asc' ? 'desc' : 'asc';
}
