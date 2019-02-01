import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents';
import { goToPath } from 'in-stores/navigation';

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
          className={columnDefinitions[key].cellClassName}
        >
          {columnDefinitions[key].getContent(item, cellOpts)}
        </Td>
      ))}
    </Tr>
  );
}
