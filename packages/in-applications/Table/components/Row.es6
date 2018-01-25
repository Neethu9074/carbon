import React from 'react';

import locals from './Row.mless';

export default function Row({ item, columnDefinitions }) {
  const keys = Object.keys(columnDefinitions);

  return (
    <tr className={locals.row}>{keys.map(key => <td key={key}>{columnDefinitions[key].getContent(item)}</td>)}</tr>
  );
}
