import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { Th } from 'in-components/tables/sharedComponents/Table';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SortableTh.mless';

export default function SortableTh({ isSortedByThisColumn, sortDirection, onClick, children, noWrap }) {
  return (
    <Th noWrap={noWrap}>
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
            height={16}
          />
        )}

        {!isSortedByThisColumn && <SvgIcon className={locals.test} type="lib_arrow_short_down" height={16} />}
      </a>
    </Th>
  );
}
