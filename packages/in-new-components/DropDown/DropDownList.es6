import React from 'react';

import locals from './DropDownList.mless';

export default function DropDownList({ numItems, renderItem, onClick }) {
  const indices = [];
  for (let i = 0; i < numItems; i++) {
    indices[i] = i;
  }
  return (
    <div className={locals.wrapper}>
      <ul className={locals.list}>
        {indices.map(i => (
          <li key={i} className={locals.item} onClick={() => onClick(i)}>
            {renderItem(i)}
          </li>
        ))}
      </ul>
    </div>
  );
}
