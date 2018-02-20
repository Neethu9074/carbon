import React from 'react';

import locals from './Row.mless';

export default function Row({ item, columnDefinitions, cellOpts }) {
  const keys = Object.keys(columnDefinitions);

  return (
    <tr className={locals.row}>
      {keys.map(key => (
        <td key={key} className={locals.cell}>
          {columnDefinitions[key].getContent(item, cellOpts)}
        </td>
      ))}
    </tr>
  );
}
