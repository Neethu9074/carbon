import React, { useEffect } from 'react';

import { enableBodyScroll, disableBodyScroll } from 'in-components/DisabledBodyScroll';
import { IndeterminateLoadingIndicator } from 'in-new-components/LoadingIndicators';
import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import StackPane from 'in-new-components/Stack/components/StackPane';
import SEVERITY_MAP from 'in-new-components/Stack/severity.json';
import tabList from 'in-new-components/Stack/tabs';

import locals from './StackPresenter.mless';

export default function StackPresenter({ stack, activeTabIndex, onTabSelect, isLoading }) {
  const { key } = tabList[activeTabIndex];
  let tabListWithHealthInfo = null;

  if (stack) {
    tabListWithHealthInfo = tabList.map(tab => {
      const { healthInfo } = stack[tab.key];

      if (healthInfo && healthInfo.type) {
        const healthSeverity = SEVERITY_MAP[healthInfo.type];

        return { ...tab, healthSeverity };
      }

      return tab;
    });
  }

  useEffect(() => {
    disableBodyScroll();

    return enableBodyScroll;
  });

  return (
    <>
      <InlineTabNavigation
        tabList={tabListWithHealthInfo ? tabListWithHealthInfo : tabList}
        activeTabIndex={activeTabIndex}
        onTabSelect={onTabSelect}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <StackPane groups={stack[key].groups} tab={key} activeTabIndex={activeTabIndex} isLoading={isLoading} />
      )}
    </>
  );
}

const Loader = () => (
  <div className={locals.pane}>
    <IndeterminateLoadingIndicator size="96" />
  </div>
);
