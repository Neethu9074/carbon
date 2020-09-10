import React from 'react';

import UpstreamDownstreamPane from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamPane';
import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import { LoadingIndicator } from 'in-new-components/LoadingIndicators';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
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
  close,
  resultApplication,
  itemsApplication,
  tagFilters,
  snapshotId,
  plugin
}) {
  useDisabledBodyScroll();

  const isLoading =
    (result.progress && result.progress.loading) || (resultApplication.progress && resultApplication.progress.loading);
  const { key } = tabList[activeTabIndex];

  return (
    <>
      <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={onTabSelect} />
      {isLoading === true ? (
        <Loader />
      ) : (
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
          close={close}
          tagFilters={tagFilters}
          snapshotId={snapshotId}
          plugin={plugin}
        />
      )}
    </>
  );
}

const Loader = () => (
  <div className={locals.pane}>
    <LoadingIndicator size="xxxl" />
  </div>
);
