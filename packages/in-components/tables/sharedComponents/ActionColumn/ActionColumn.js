import React from 'react';

import { Td } from 'in-components/tables/sharedComponents/Table';
import Button from 'in-new-components/Button';

import locals from './ActionColumn.mless';

export default function ActionCol({ cols, action, label }) {
  return (
    <Td colSpan={cols}>
      <div className={locals.wrapper}>
        <Button
          kind="action"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            action();
          }}
        >
          {label}
        </Button>
      </div>
    </Td>
  );
}
