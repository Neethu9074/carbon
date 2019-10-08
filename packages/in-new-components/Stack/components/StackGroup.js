import React from 'react';

import RELATIONSHIP_MAP from 'in-new-components/Stack/relationships.json';
import StackItem from 'in-new-components/Stack/components/StackItem';

import locals from './StackGroup.mless';

export default function StackGroup({ group: { relationship, items } }) {
  return (
    <div className={locals.group}>
      <div className={locals.head}>
        {RELATIONSHIP_MAP[relationship]} ({items.length})
      </div>
      {items.map(item => (
        <StackItem key={item.id} item={item} />
      ))}
    </div>
  );
}
