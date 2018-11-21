import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents';

export default function Row({ item, size, columnDefinitions, getRowProps, cellOpts, onMouseEnter, onMouseLeave }) {
  const keys = Object.keys(columnDefinitions);
  const rowProps = getRowProps ? getRowProps(item) : {};

  return (
    <Tr onMouseEnter={() => onMouseEnter(item)} onMouseLeave={() => onMouseLeave(item)} size={size} {...rowProps}>
      {keys.map(key => (
        <Td key={key} noWrap={columnDefinitions[key].noWrap} ellipsis={columnDefinitions[key].ellipsis}>
          {columnDefinitions[key].getContent(item, cellOpts)}
        </Td>
      ))}
    </Tr>
  );
}
