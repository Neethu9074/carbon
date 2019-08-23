import { storiesOf } from '@storybook/react';
import React from 'react';

import EntityVersionListPresenter from 'in-new-components/EntityVersionList/EntityVersionListPresenter';
import { plugins } from 'in-forge/constants';

import Root from '../_helpers/Root';

storiesOf('Components/Entity Version List', module).add('Entity Version List', () => <DefaultStory />);

function DefaultStory() {
  return (
    <Root>
      <EntityVersionListPresenter plugin={plugins.kubernetesCluster} versions={getItems(6)} />
    </Root>
  );
}

function getItems(numItems) {
  const items = [];

  const oneMinute = 1000 * 60;
  const now = Date.now();
  let gap = 0;
  for (let i = 1; i < numItems + 1; i++) {
    if (i > 3) {
      gap = 1000;
    }
    items.push({ from: gap + (now - (i + 1) * oneMinute), to: gap + (i === 1 ? null : now - i * oneMinute) });
  }

  return items;
}
