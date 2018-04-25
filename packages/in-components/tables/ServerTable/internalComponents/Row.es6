import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents';

export default function Row({ item, columnDefinitions, cellOpts, onMouseEnter, onMouseLeave }) {
  const keys = Object.keys(columnDefinitions);

  return (
    <Tr onMouseEnter={() => onMouseEnter(item)} onMouseLeave={() => onMouseLeave(item)}>
      {keys.map(key => <Td key={key}>{columnDefinitions[key].getContent(item, cellOpts)}</Td>)}
    </Tr>
  );
}
