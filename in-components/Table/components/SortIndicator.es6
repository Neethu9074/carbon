import React from 'react';

export default function SortIndicator({ title, index, sortIndex, sortDirection, onChangeSort }) {
  const onClick = e => {
    e.preventDefault();
    onChangeSort(index, index === sortIndex ? inverseDirection(sortDirection) : 'asc');
  };

  return (
    <a href="" onClick={onClick}>
      {title}

      {index === sortIndex ? sortDirection : null}
    </a>
  );
}

function inverseDirection(direction) {
  return direction === 'asc' ? 'desc' : 'asc';
}
