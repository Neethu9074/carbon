/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import connectTo from 'in-hoc/connectTo';

const itemPrefix = 'i_';

export default function WithStarredItems({ pinnedItemIdsByType, getItem, timeConfig, render }) {
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

const Connector = connectTo(collectObservables, function(props) {
  return props.render(collectItemResults(props));
});

function collectObservables({ items, getItem, timeConfig }) {
  const observables = {};

  for (let i = 0; i < items.length; i++) {
    const { id, type } = items[i];
    observables[`${itemPrefix}${id}`] = get(id, type, timeConfig, getItem);
  }

  return observables;
}

function get(id, type, timeConfig, getItem) {
  return getItem(id, timeConfig, type).map(result => ({ id, type, result }));
}

function collectItemResults(props) {
  return Object.keys(props)
    .filter(key => key.indexOf(itemPrefix) === 0)
    .map(key => props[key])
    .filter(Boolean);
}
