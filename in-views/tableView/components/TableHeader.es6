import React from 'react';

import {getTableDefinition} from 'in-sdk/snapshot';

import './TableHeader.less';

const block = 'in-table-view-table-header';

const cellClassName = `${block}__cell`;

export default function TableHeader({plugin}) {
  const tableDefinition = getTableDefinition(plugin);
  return (
    <div className={block}>
      {tableDefinition.map((column, i) =>
        <p className={cellClassName}
           key={i}>
          {column.title}
        </p>
      )}

      <p className={cellClassName}>
        Health
      </p>
    </div>
  );
}
