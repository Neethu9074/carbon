import { Map } from 'immutable';
import React from 'react';

import { compareIgnoreCase } from 'in-services/util/string';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';

export default function ContextPopup({ context }) {
  return (
    <Dialog header="Context" onClose={close}>
      {context
        .keySeq()
        .toArray()
        .sort(compareIgnoreCase)
        .map(key => {
          const items = context.get(key);
          if (Map.isMap(items)) {
            return <MapItems key={key} name={key} items={items} />;
          }
          return <SeqItems key={key} name={key} items={items} />;
        })}
    </Dialog>
  );
}

function MapItems({ name, items }) {
  return (
    <div>
      <p>
        <strong>{name}</strong>
      </p>

      <dl>
        {items
          .keySeq()
          .toArray()
          .sort(compareIgnoreCase)
          .map(k => [<dt key={`${k}-key`}>{k}</dt>, <dd key={`${k}-value`}>{items.get(k)}</dd>])}
      </dl>
    </div>
  );
}

function SeqItems({ name, items }) {
  return (
    <div>
      <p>
        <strong>{name}</strong>
      </p>

      <ul>
        {items
          .toArray()
          .sort(compareIgnoreCase)
          .map(v => <li key={v}>{v}</li>)}
      </ul>
    </div>
  );
}
