import React, { useState } from 'react';

import TabSwitch from 'in-websites/alerting/components/TabSwitch';

export default {
  title: 'Templates/website/alerting/components/TabSwitch',
  component: TabSwitch
};

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

export const TabSwitcher = () => (
  <div style={{ width: 345 }}>
    <TabSwitch tabs={tabs} />
  </div>
);

export const TabSwitcherWithInitialActiveTab = () => (
  <div style={{ width: 345 }}>
    <TabSwitch tabs={tabs} initialActiveTab={1} />
  </div>
);

export const WithActiveTabTracker = () => {
  const initialActiveTab = 1;
  const [index, setIndex] = useState();
  const activeTabTracker = index => setIndex(index);

  return (
    <div style={{ width: 345 }}>
      <p>Active tab at index: {index} </p>
      <TabSwitch tabs={tabs} activeTabTracker={activeTabTracker} initialActiveTab={initialActiveTab} />
    </div>
  );
};
