import React from 'react';

import {getTableDefinition} from 'in-sdk/snapshot';

import './TableHeader.less';

const block = 'in-table-view-table-header';
const cellClassName = `${block}__cell`;

export default function TableHeader({plugin}) {
  const tableDefinition = getTableDefinition(plugin);
  return (
    <div className={block}>
      {tableDefinition.map((column, i) => {
        let style;
        if (column.style && column.style.maxWidth) {
          style = {
            maxWidth: column.style.maxWidth
          };
        }
        return (
          <p className={cellClassName}
             style={style}
             key={i}>
            {column.title}
          </p>
        );
      })}
    </div>
  );
}
