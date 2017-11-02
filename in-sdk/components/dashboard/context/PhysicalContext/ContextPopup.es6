import { Map } from 'immutable';
import React from 'react';

import { compareIgnoreCase } from 'in-services/util/string';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';
import Table from 'in-components/Table';

const mapCols = [
  {
    title: 'Key',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Value',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.value;
      }
    }
  }
];

const seqCols = [
  {
    title: 'Value',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  }
];

export default function ContextPopup({ context }) {
  return (
    <Dialog header="Context" onClose={close}>
      {context
        .keySeq()
        .toArray()
        .sort(compareIgnoreCase)
        .map(key => {
          const items = context.get(key);

          let cols;
          let rows;

          if (Map.isMap(items)) {
            cols = mapCols;
            rows = items
              .map((value, key) => ({ value, key }))
              .valueSeq()
              .toArray();
          } else {
            cols = seqCols;
            rows = items.toArray().map(key => ({ key }));
          }

          return (
            <div key={key}>
              <p>
                <strong>{key}</strong>
              </p>

              <Table rows={rows} cols={cols} maxItemsPerPage={10} />
            </div>
          );
        })}
    </Dialog>
  );
}
