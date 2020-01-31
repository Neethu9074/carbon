import React, { useState } from 'react';

import UpstreamDownstreamLoading from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamLoading';
import UpstreamDownstreamMetric from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamMetric';
import UpstreamDownstreamPane from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamPane';
import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import tabList from 'in-new-components/UpstreamDownstream/tabs';
import Link from 'in-components/Link/Link';

import locals from './UpstreamDownstreamPresenter.mless';

export default function UpstreamDownstreamPresenter({
  items,
  activeTabIndex,
  onTabSelect,
  timeConfig,
  result,
  serviceId,
  applicationId
}) {
  const isLoading = result.progress && result.progress.loading;
  const { key } = tabList[activeTabIndex];
  const [selectedMetric, onChangeMetric] = useState('errors');

  return (
    <div className={locals.wrapper}>
      <InlineTabNavigation
        tabList={tabList}
        activeTabIndex={activeTabIndex}
        onTabSelect={onTabSelect}
        actions={
          <UpstreamDownstreamMetric
            metrics={[
              { text: 'Errors', key: 'errors', kind: null, icon: 'lib_help_error_warning' },
              { text: 'Latency', key: 'latency', kind: null, icon: 'lib_bar_chart' }
            ]}
            selectedMetric={selectedMetric}
            onChangeMetric={onChangeMetric}
          />
        }
      />
      {isLoading === true ? (
        <UpstreamDownstreamLoading />
      ) : (
        <>
          <UpstreamDownstreamPane
            applicationId={applicationId}
            area={key}
            items={items}
            result={result}
            selectedMetric={selectedMetric}
            serviceId={serviceId}
            timeConfig={timeConfig}
            totalHits={result.data.totalHits}
          />
          {result.data.totalHits > 5 && (
            <div className={locals.seeAll}>
              <Link href$={getServiceDashboard(serviceId, { tab: '/flowMap' })}>
                See all {result.data.totalHits} Services
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
