import React, { useEffect } from 'react';

import { enableBodyScroll, disableBodyScroll } from 'in-components/DisabledBodyScroll';
import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import StackPane from 'in-new-components/Stack/components/StackPane';
import tabList from 'in-new-components/Stack/tabs';
export default function StackPresenter({ stack, activeTabIndex, onTabSelect }) {
  const { key } = tabList[activeTabIndex];

  useEffect(() => {
    disableBodyScroll();

    return enableBodyScroll;
  });

  return (
    <>
      <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={onTabSelect} />
      <StackPane groups={stack[key].groups} area={key} activeTabIndex={activeTabIndex} />
    </>
  );
}
