import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents';
import { joinClassNames } from 'in-services/util/classnames';
import { goToPath } from 'in-stores/navigation';

import locals from './Row.mless';

export default function Row({
  item,
  size,
  columnDefinitions,
  getRowProps,
  getRowLink,
  cellOpts,
  onMouseEnter,
  onMouseLeave
}) {
  const rowProps = getRowProps ? getRowProps(item) : {};
  const rowLinkHref = getRowLink ? getRowLink(item) : null;
  const keys = Object.keys(columnDefinitions);
  const linkClickHandler = rowLinkHref ? { onClick: () => goToPath(rowLinkHref) } : {};
  return (
    <Tr
      onMouseEnter={() => onMouseEnter(item)}
      onMouseLeave={() => onMouseLeave(item)}
      size={size}
      {...linkClickHandler}
      {...rowProps}
    >
      {keys.map(key => (
        <Td
          key={key}
          noWrap={columnDefinitions[key].noWrap}
          ellipsis={columnDefinitions[key].ellipsis}
          className={getCellClassName(columnDefinitions[key])}
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
