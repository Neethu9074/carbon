import React from 'react';

import RELATIONSHIP_MAP from 'in-new-components/Stack/relationships.json';
import StackItem from 'in-new-components/Stack/components/StackItem';
import { Ul } from 'in-new-components/lists/List';

import locals from './StackGroup.mless';

export default function StackGroup({ group: { relationship, items } }) {
  return (
    <div>
      <div className={locals.groupHead}>
        {RELATIONSHIP_MAP[relationship]} ({items.length})
      </div>
      <Ul>
        {items.map(item => (
          <StackItem key={item.id} item={item} />
        ))}
      </Ul>
    </div>
  );
}
