import React from 'react';

import Link from 'in-components/Link';

import locals from './Row.mless';

export default function Row({ item, columnDefinitions }) {
  const keys = Object.keys(columnDefinitions);

  return (
    <tr className={locals.row}>
      {keys.map(key => <td key={key}>{getComponentByType(columnDefinitions[key], item)}</td>)}
    </tr>
  );
}

function getComponentByType(columnDefinition, item) {
  const content = columnDefinition.getContent(item);

  if (columnDefinition.getHref$) {
    return <Link href$={columnDefinition.getHref$(item)}>{columnDefinition.getContent(item)}</Link>;
  }

  return content;
}
