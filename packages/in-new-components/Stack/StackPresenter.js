import React, { useEffect, useState } from 'react';

import { contextGuideStackLoadedDurationTracker } from 'in-infrastructure/tracking/tracking';
import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import SelfEntityHeader from 'in-new-components/Stack/SelfEntityHeader';
import { LoadingIndicator } from 'in-new-components/LoadingIndicators';
import { setSingle, getSingle } from 'in-services/settings/settings';
import EmptyPane from 'in-new-components/Stack/components/EmptyPane';
import StackPane from 'in-new-components/Stack/components/StackPane';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import SEVERITY_MAP from 'in-new-components/Stack/severity.json';
import tabList from 'in-new-components/Stack/tabs';

import locals from './StackPresenter.mless';

const preferredContextGuideTabSettingsKey = 'preferredContextGuideTab';

export default function StackPresenter({
  applicationId,
  boundaryScope,
  serviceId,
  stack,
  isLoading,
  productArea,
  selfEntity,
  plugin
}) {
  useDisabledBodyScroll();
  useEffect(() => trackLoading(isLoading, { dashboard: plugin || productArea }), [isLoading]);

  if (isLoading) {
    return <Loader />;
  }

  if (isEmpty(stack)) {
    return <EmptyStackPane productArea={productArea} selfEntity={selfEntity} />;
  }

  return (
    <NavigableStack
      applicationId={applicationId}
      boundaryScope={boundaryScope}
      serviceId={serviceId}
      stack={stack}
      selfEntity={selfEntity}
    />
  );
}

const Loader = () => (
  <>
    <InlineTabNavigation tabList={tabList} isDisabled />
    <div className={locals.pane}>
      <LoadingIndicator size="xxxl" />
    </div>
  </>
);

const productAreaItems = {
  application: 'application',
  service: 'service',
  infrastructure: 'resource',
  kubernetes: 'resource'
};

const EmptyStackPane = ({ productArea, selfEntity }) => {
  const itemText = productAreaItems[productArea] || 'item';
  return (
    <>
      <SelfEntityHeader selfEntity={selfEntity} />
      <InlineTabNavigation tabList={tabList} isDisabled />
      <div className={locals.pane}>
        <EmptyPane
          icon="lib_help_error_info_circle"
          emptyMessage="Instana was not able to find any related items"
          detailMessage={`We don't have enough information to relate this ${itemText} to any other items`}
        />
      </div>
    </>
  );
};

const NavigableStack = ({ applicationId, boundaryScope, serviceId, stack, selfEntity }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(getInitialTabIndexFn(stack));

  const { key } = tabList[activeTabIndex];
  const onTabSelect = index => {
    setPreferredTabIndex(index);
    setActiveTabIndex(index);
  };

  const enrichedTabList = enrichTabList(stack);

  return (
    <>
      <SelfEntityHeader selfEntity={selfEntity} />
      <InlineTabNavigation tabList={enrichedTabList} activeTabIndex={activeTabIndex} onTabSelect={onTabSelect} />
      <StackPane
        applicationId={applicationId}
        boundaryScope={boundaryScope}
        serviceId={serviceId}
        groups={stack[key].groups}
        tab={key}
        activeTabIndex={activeTabIndex}
      />
    </>
  );
};

function getPreferredTabIndex() {
  const preferredTabName = getSingle(preferredContextGuideTabSettingsKey);
  const preferredTabIndex = tabList.findIndex(tab => tab.key === preferredTabName);
  return preferredTabIndex >= 0 ? preferredTabIndex : 0;
}

function setPreferredTabIndex(index) {
  const { key: preferredTabName } = tabList[index];
  setSingle(preferredContextGuideTabSettingsKey, preferredTabName);
}

function isEmpty(stack) {
  return groupCount(stack) === 0;
}

function groupCount(stack) {
  return tabList.reduce((sum, { key }) => sum + stack[key].groups.length, 0);
}

function getInitialTabIndexFn(stack) {
  return () => {
    const preferredTab = getPreferredTabIndex();
    const { key } = tabList[preferredTab];

    if (stack[key].groups.length === 0) {
      return getFirstNonEmptyTabIndex(stack);
    }

    return preferredTab;
  };
}

function getFirstNonEmptyTabIndex(stack) {
  return tabList.findIndex(({ key }) => stack[key].groups.length > 0);
}

function enrichTabList(stack) {
  return tabList.map(tab => {
    const { healthInfo, groups } = stack[tab.key];

    const healthSeverity = healthSeverityFromHealthInfo(healthInfo);

    const isDisabled = groups.length === 0;
    const disabledReason = tab.emptyMessage;

    return { ...tab, healthSeverity, isDisabled, disabledReason };
  });
}

function healthSeverityFromHealthInfo(healthInfo) {
  if (!healthInfo || !healthInfo.type) {
    return undefined;
  }

  return SEVERITY_MAP[healthInfo.type];
}

function trackLoading(isLoading, props) {
  if (isLoading) {
    contextGuideStackLoadedDurationTracker.start();
  } else {
    contextGuideStackLoadedDurationTracker.stop(props);
  }
}
