import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import './SortIndicator.less';

const block = 'in-website-table-sort-indicator';

export default function SortIndicator({ title, index, className, sortIndex, sortDirection, onChangeSort }) {
  const isActive = index === sortIndex;

  return (
    <div
      onClick={() => onChangeSort(index, isActive ? inverseDirection(sortDirection) : 'asc')}
      className={evaluateClassNames({
        [block]: true,
        [`${block}--active`]: isActive,
        [`${className}`]: true
      })}
    >
      {title}
      <SvgIcon
        className={evaluateClassNames({
          [`${block}__icon`]: isActive,
          [`${block}__icon--hidden`]: !isActive
        })}
        type={sortDirection === 'asc' ? 'arrow_up_straight' : 'arrow_down_straight'}
        width={12}
        height={12}
      />
    </div>
  );
}

function inverseDirection(direction) {
  return direction === 'asc' ? 'desc' : 'asc';
}
