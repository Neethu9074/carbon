import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents';
import { joinClassNames } from 'in-services/util/classnames';

import locals from './Row.mless';

export default function Row({
  item,
  size,
  columnDefinitions,
  getRowProps,
  onRowClick,
  cellOpts,
  onMouseEnter,
  onMouseLeave
}) {
  const rowProps = getRowProps ? getRowProps(item) : {};
  const rowClickHandler = onRowClick ? { onClick: e => onRowClick(item, e) } : {};
  const keys = Object.keys(columnDefinitions);
  return (
    <Tr
      onMouseEnter={() => onMouseEnter(item)}
      onMouseLeave={() => onMouseLeave(item)}
      size={size}
      {...rowClickHandler}
      {...rowProps}
    >
      {keys.map(key => (
        <Td
          key={key}
          noWrap={columnDefinitions[key].noWrap}
          ellipsis={columnDefinitions[key].ellipsis}
          className={joinClassNames(getCellClassName(columnDefinitions[key]), onRowClick ? locals.clickable : null)}
        >
          {columnDefinitions[key].getContent(item, cellOpts)}
        </Td>
      ))}
    </Tr>
  );
}

function getCellClassName(columnDefinition) {
  if (columnDefinition.tableAction && columnDefinition.cellClassName) {
    return joinClassNames(columnDefinition.cellClassName, locals.tableActionCell);
  } else if (columnDefinition.tableAction) {
    return locals.tableActionCell;
  }
  return columnDefinition.cellClassName;
}
