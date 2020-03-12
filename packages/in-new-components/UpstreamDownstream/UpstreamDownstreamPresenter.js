import React, { useEffect } from 'react';

import UpstreamDownstreamPane from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamPane';
import { enableBodyScroll, disableBodyScroll } from 'in-components/DisabledBodyScroll';
import { IndeterminateLoadingIndicator } from 'in-new-components/LoadingIndicators';
import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import tabList from 'in-new-components/UpstreamDownstream/tabs';

import locals from './UpstreamDownstreamPresenter.mless';

export default function UpstreamDownstreamPresenter({
  items,
  activeTabIndex,
  onTabSelect,
  timeConfig,
  result,
  serviceId,
  applicationId,
  endpointId,
  productArea,
  boundaryScope,
  close,
  resultApplication,
  itemsApplication
}) {
  const isLoading =
    (result.progress && result.progress.loading) || (resultApplication.progress && resultApplication.progress.loading);
  const { key } = tabList[activeTabIndex];

  useEffect(() => {
    disableBodyScroll();

    return enableBodyScroll;
  });

  return (
    <>
      <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={onTabSelect} />
      {isLoading === true ? (
        <Loader />
      ) : (
        <>
          <UpstreamDownstreamPane
            applicationId={applicationId}
            activeTab={key}
            items={items}
            itemsApplication={itemsApplication}
            result={result}
            resultApplication={resultApplication}
            serviceId={serviceId}
            timeConfig={timeConfig}
            endpointId={endpointId}
            productArea={productArea}
            boundaryScope={boundaryScope}
            close={close}
          />
        </>
      )}
    </>
  );
}

const Loader = () => (
  <div className={locals.pane}>
    <IndeterminateLoadingIndicator size="96" />
  </div>
);
