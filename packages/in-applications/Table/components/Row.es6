import React from 'react';

import locals from './Row.mless';

export default function Row({ item, columnDefinitions }) {
  const keys = Object.keys(columnDefinitions);

  return (
    <tr className={locals.row}>
      {keys.map(key => {
        const columnDefinition = columnDefinitions[key];
        return (
          <td key={key} className={locals.column}>
            {columnDefinition.getContent(item)}
          </td>
        );
      })}
    </tr>
  );
}
