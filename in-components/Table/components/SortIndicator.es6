import React from 'react';

import './SortIndicator.less';

const block = 'in-table-sort-indicator';

export default function SortIndicator({ title, index, sortIndex, sortDirection, onChangeSort }) {
  const onClick = e => {
    e.preventDefault();
    onChangeSort(index, index === sortIndex ? inverseDirection(sortDirection) : 'asc');
  };

  return (
    <a href="" onClick={onClick} className={block}>
      {title}

      {index === sortIndex ? sortDirection : null}
    </a>
  );
}

function inverseDirection(direction) {
  return direction === 'asc' ? 'desc' : 'asc';
}
