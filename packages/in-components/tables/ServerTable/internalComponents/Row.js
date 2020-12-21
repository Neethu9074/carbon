import React from 'react';

import classNames from 'classnames';
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
        const { id, noWrap, ellipsis, cellClassName, tableAction, getContent } = columnDefinitions[key];
        return (
          <Td
            key={id}
            noWrap={noWrap}
            ellipsis={ellipsis}
            className={classNames({
              [cellClassName]: cellClassName,
              [locals.tableActionCell]: tableAction,
              [locals.clickable]: onRowClick
            })}
          >
            {getContent(item, cellOpts, id)}
          </Td>
        );
      })}
    </Tr>
  );
}
