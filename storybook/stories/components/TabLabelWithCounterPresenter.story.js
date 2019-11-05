import { storiesOf } from '@storybook/react';
import React from 'react';

import TabLabelWithCounterPresenter from 'in-new-components/LocationAwareTabView/tabs/TabLabelWithCounterPresenter';

import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Components/TabLabelWithCounter', module).add('TabLabelWithCounter', () => <TabLabelWithCounterStory />);

function TabLabelWithCounterStory() {
  const countersResult = { data: { vms: 5 } };

  return (
    <Root>
      <Section title="Default">
        <TabLabelWithCounterPresenter label="Virtual Machines" countersResult={countersResult} resultPropName="vms" />
      </Section>
    </Root>
  );
}
