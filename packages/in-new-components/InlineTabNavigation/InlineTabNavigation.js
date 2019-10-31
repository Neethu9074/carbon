import React from 'react';

import Tab from 'in-new-components/InlineTabNavigation/Tab';

import locals from './InlineTabNavigation.mless';

export default function InlineTabNavigation({ tabList, activeTabIndex, onTabSelect }) {
  return (
    <ul className={locals.banner}>
      {tabList.map((tab, i) => (
        <Tab key={i} index={i} isActive={activeTabIndex === i} onTabSelect={onTabSelect} {...tab} />
      ))}
    </ul>
  );
}
