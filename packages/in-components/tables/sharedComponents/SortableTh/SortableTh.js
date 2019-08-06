import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { Th } from 'in-components/tables/sharedComponents/Table';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SortableTh.mless';

export default function SortableTh({
  isSortedByThisColumn,
  sortDirection,
  onClick,
  children,
  className,
  wrapContent,
  noWrap,
  width
}) {
  return (
    <Th className={className} noWrap={noWrap} width={width} wrapContent={wrapContent}>
      <a
        href=""
        className={evaluateClassNames({
          [locals.column]: true,
          [locals.activeColumn]: isSortedByThisColumn
        })}
        onClick={onClick}
      >
        {children}
        {isSortedByThisColumn && (
          <SvgIcon
            className={locals.icon}
            type={sortDirection === 'ASC' ? 'lib_arrow_short_up' : 'lib_arrow_short_down'}
            size="xs"
          />
        )}

        {!isSortedByThisColumn && <SvgIcon className={locals.test} type="lib_arrow_short_down" size="xs" />}
      </a>
    </Th>
  );
}
