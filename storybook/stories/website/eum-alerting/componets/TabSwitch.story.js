import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import TabSwitch from 'in-websites/eum-alerting/components/TabSwitch';
import Root from '../../../_helpers/Root';

storiesOf('websites/eum-alerting/components', module)
  .add('TabSwitcher', () => <TabSwitcher />)
  .add('TabSwitcher with initial active tab set', () => <TabSwitcherWithInitialActiveTab />)
  .add('TabSwitcher with active tab tracking', () => <WithActiveTabTracker />);

const tabs = [
  {
    label: 'Select JS Error',
    element: <h1>Hello Tab 0</h1>
  },
  {
    label: 'Provide manual pattern',
    element: <h1>Hello Tab 1</h1>
  }
];

function TabSwitcher() {
  return (
    <Root style={{ width: 345 }}>
      <TabSwitch tabs={tabs} />
    </Root>
  );
}

function TabSwitcherWithInitialActiveTab() {
  return (
    <Root style={{ width: 345 }}>
      <TabSwitch tabs={tabs} initialActiveTab={1} />
    </Root>
  );
}

function WithActiveTabTracker() {
  const initialActiveTab = 1;

  const [index, setIndex] = useState();

  const activeTabTracker = index => {
    setIndex(index);
  };

  return (
    <Root style={{ width: 345 }}>
      <p>Active tab at index: {index} </p>
      <TabSwitch tabs={tabs} activeTabTracker={activeTabTracker} initialActiveTab={initialActiveTab} />
    </Root>
  );
}
