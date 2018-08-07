import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents';

export default function Row({ item, size, columnDefinitions, cellOpts, onMouseEnter, onMouseLeave }) {
  const keys = Object.keys(columnDefinitions);

  return (
    <Tr onMouseEnter={() => onMouseEnter(item)} onMouseLeave={() => onMouseLeave(item)} size={size}>
      {keys.map(key => (
        <Td key={key} noWrap={columnDefinitions[key].noWrap}>
          {columnDefinitions[key].getContent(item, cellOpts)}
        </Td>
      ))}
    </Tr>
  );
}
