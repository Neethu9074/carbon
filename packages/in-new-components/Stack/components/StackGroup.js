import React from 'react';

import RELATIONSHIP_MAP from 'in-new-components/Stack/relationships.json';
import StackItem from 'in-new-components/Stack/components/StackItem';
import { getSingular, getPlural } from 'in-sdk/pluginName';
import { Ul, Li } from 'in-new-components/lists/List';

import locals from './StackGroup.mless';

export default function StackGroup({ group: { relationship, type, items, itemCount }, tab }) {
  const numMoreItems = itemCount - items.length;
  return (
    <div>
      <div className={locals.groupHead}>
        {RELATIONSHIP_MAP[relationship]} {itemCount} {itemCount > 1 ? getPlural(type) : getSingular(type)}
      </div>
      <Ul framed="topBottom">
        {items.map(item => (
          <StackItem key={item.id} item={item} tab={tab} />
        ))}
        {numMoreItems > 0 && (
          <Li className={locals.moreItems} noAlternatingBg>
            +{numMoreItems} more...
          </Li>
        )}
      </Ul>
    </div>
  );
}
