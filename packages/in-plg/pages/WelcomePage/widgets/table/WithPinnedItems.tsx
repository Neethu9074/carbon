/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

//@ts-expect-error doesn't contain declaration file
import connectTo from 'in-hoc/connectTo';

const itemPrefix = 'i_';

type WithPinnedItemProps = {
  pinnedItemIdsByType?: any;
  getItem?: any;
  timeConfig?: any;
  render?: any;
  // eslint-disable-next-line react/no-unused-prop-types
  items?: any;
};

export default function WithPinnedItems({ pinnedItemIdsByType, getItem, timeConfig, render }: WithPinnedItemProps) {
  const items = [];
  const types = Object.keys(pinnedItemIdsByType);
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const ids = pinnedItemIdsByType[type];
    for (let i2 = 0; i2 < ids.length; i2++) {
      items.push({ type, id: ids[i2] });
    }
  }

  return <Connector items={items} getItem={getItem} timeConfig={timeConfig} render={render} />;
}

const Connector = connectTo(collectObservables, function (props: WithPinnedItemProps) {
  const results = collectItemResults(props);
  return props.render(results);
});

function collectObservables({ items, getItem, timeConfig }: WithPinnedItemProps) {
  const observables = {};

  for (let i = 0; i < items.length; i++) {
    const { id, type } = items[i];
    //@ts-expect-error doesn't contain declaration file
    observables[`${itemPrefix}${id}`] = get(id, type, timeConfig, getItem);
  }

  return observables;
}

function get(id: string, type: string, timeConfig: any, getItem: any) {
  return getItem(id, timeConfig, type).map((result: any) => ({ id, type, result }));
}

function collectItemResults(props: WithPinnedItemProps) {
  return (
    Object.keys(props)
      .filter(key => key.indexOf(itemPrefix) === 0)
      //@ts-expect-error doesn't contain declaration file
      .map((key: string) => props[key])
      .filter(Boolean)
  );
}
