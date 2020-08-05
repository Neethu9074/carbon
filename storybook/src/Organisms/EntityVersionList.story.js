import React from 'react';

import EntityVersionListPresenter from 'in-new-components/EntityVersionList/EntityVersionListPresenter';
import { plugins } from 'in-forge/constants';

export default {
  title: 'Organisms|EntityVersionList',
  parameters: {
    // ignoring this story because it renders differently everytime
    chromatic: { disable: true }
  },
  component: EntityVersionListPresenter
};

export function Default() {
  return <EntityVersionListPresenter plugin={plugins.kubernetesCluster} versions={getItems(6)} />;
}

function getItems(numItems) {
  const items = [];

  const oneMinute = 1000 * 60;
  const now = Date.now();
  let gap = 0;
  for (let i = 1; i < numItems + 1; i++) {
    if (i > 2) {
      gap = 1000;
    }
    items.push({ from: gap + (now - (i + 1) * oneMinute), to: gap + (i === 1 ? null : now - i * oneMinute) });
  }

  return items;
}
