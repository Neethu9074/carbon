import React from 'react';

import RELATIONSHIP_MAP from 'in-new-components/Stack/relationships.json';
import StackItem from 'in-new-components/Stack/components/StackItem';
import { getSingular, getPlural } from 'in-sdk/pluginName';
import { Ul } from 'in-new-components/lists/List';

import locals from './StackGroup.mless';

export default function StackGroup({ group: { relationship, type, items }, area }) {
  return (
    <div>
      <div className={locals.groupHead}>
        {RELATIONSHIP_MAP[relationship]} {items.length} {items.length > 1 ? getPlural(type) : getSingular(type)}
      </div>
      <Ul>
        {items.map(item => (
          <StackItem key={item.id} item={item} area={area} />
        ))}
      </Ul>
    </div>
  );
}
