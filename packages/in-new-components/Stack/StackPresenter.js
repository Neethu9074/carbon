import React from 'react';

import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import StackPane from 'in-new-components/Stack/components/StackPane';
import tabList from 'in-new-components/Stack/tabs';
export default function StackPresenter({ stack, activeTabIndex, onTabSelect }) {
  const { key } = tabList[activeTabIndex];

  return (
    <>
      <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={onTabSelect} />
      <StackPane groups={stack[key].groups} area={key} />
    </>
  );
}
