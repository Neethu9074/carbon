import React, { useEffect } from 'react';

import { enableBodyScroll, disableBodyScroll } from 'in-components/DisabledBodyScroll';
import { IndeterminateLoadingIndicator } from 'in-new-components/LoadingIndicators';
import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import StackPane from 'in-new-components/Stack/components/StackPane';
import tabList from 'in-new-components/Stack/tabs';

import locals from './StackPresenter.mless';
export default function StackPresenter({ stack, activeTabIndex, onTabSelect, isLoading }) {
  const { key } = tabList[activeTabIndex];

  useEffect(() => {
    disableBodyScroll();

    return enableBodyScroll;
  });

  return (
    <>
      <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={onTabSelect} />
      {isLoading ? (
        <Loader />
      ) : (
        <StackPane groups={stack[key].groups} area={key} activeTabIndex={activeTabIndex} isLoading={isLoading} />
      )}
    </>
  );
}

const Loader = () => (
  <div className={locals.pane}>
    <IndeterminateLoadingIndicator size="96" />
  </div>
);
