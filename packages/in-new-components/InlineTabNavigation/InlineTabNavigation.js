import React from 'react';

import Tab from 'in-new-components/InlineTabNavigation/Tab';

import locals from './InlineTabNavigation.mless';

export default function InlineTabNavigation({ tabList, activeTabIndex, onTabSelect, actions, isDisabled = false }) {
  return (
    <div className={locals.wrapper}>
      <ul className={locals.banner}>
        {tabList.map((tab, i) => (
          <Tab
            key={i}
            index={i}
            isActive={activeTabIndex === i}
            isDisabled={isDisabled || tab.disabled}
            onTabSelect={onTabSelect}
            {...tab}
          />
        ))}
      </ul>
      {actions}
    </div>
  );
}
