import React from 'react';

import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';

export default function MoreBarItem({ onClick, label = 'All filters' }) {
  return (
    <BarItem onClick={onClick} showMore>
      {label}
    </BarItem>
  );
}
