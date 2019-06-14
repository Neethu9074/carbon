import { storiesOf } from '@storybook/react';
import React from 'react';

import EntityVersionListPresenter from 'in-new-components/EntityVersionList/EntityVersionListPresenter';
import { plugins } from 'in-forge/constants';

import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Components/Entity Version List', module).add('Entity Version List', () => <DefaultStory />);

function DefaultStory() {
  return (
    <Root>
      <Section title="No versions">
        <EntityVersionListPresenter plugin={plugins.kubernetesCluster} snapshotVersions={getItems(0)} />
      </Section>
      <Section title="Default">
        <EntityVersionListPresenter plugin={plugins.kubernetesCluster} snapshotVersions={getItems(6)} />
      </Section>
    </Root>
  );
}

function getItems(numItems) {
  const items = [];

  const oneMinute = 1000 * 60;
  const now = Date.now();
  for (let i = 1; i < numItems + 1; i++) {
    items.push({ from: now - (i + 1) * oneMinute, to: i === 1 ? null : now - i * oneMinute });
  }

  return items;
}
