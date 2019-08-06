import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { Tr, Td } from 'in-components/tables/sharedComponents';

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
      {keys.map(key => {
        const columnDefinition = columnDefinitions[key];
        return (
          <Td
            key={key}
            noWrap={columnDefinition.noWrap}
            ellipsis={columnDefinition.ellipsis}
            className={evaluateClassNames({
              [columnDefinition.cellClassName]: columnDefinition.cellClassName,
              [locals.tableActionCell]: columnDefinition.tableAction,
              [locals.clickable]: onRowClick
            })}
          >
            {columnDefinition.getContent(item, cellOpts, columnDefinition.id)}
          </Td>
        );
      })}
    </Tr>
  );
}
