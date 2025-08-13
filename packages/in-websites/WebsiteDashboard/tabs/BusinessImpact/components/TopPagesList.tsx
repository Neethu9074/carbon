/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';
import { Link } from '@instana/components';

// @ts-expect-error Needs to be migrated to TS
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
// @ts-expect-error Needs to be migrated to TS
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import getTopPagesForWebsites, { BusinessDataQuery } from 'in-bizops/subscriptions/getTopPagesForWebsites';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface TopPagesListProps {
  timeConfig: TimeConfig;
}

export default function TopPagesList({ timeConfig }: TopPagesListProps) {
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.tabs.businessImpact.topListTitle')}
      metrics={['pages']}
      timeConfig={timeConfig}
      formatters={[number.compact]}
      Renderer={TopListCardPresenter}
      getList={getListFromBackend}
      Label={Label}
      Metric={Metric}
    />
  );
}

function Label({ item }: { item: any }) {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link onClick={() => trackTopListNavigation()} href="#">
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }: { formattedMetricValue: string }) {
  return <>{formattedMetricValue}</>;
}

interface GetListProps {
  timeConfig: TimeConfig;
}

function getListFromBackend({ timeConfig }: GetListProps) {
  const query: BusinessDataQuery = {
    timeConfig,
    dataType: 'EUM',
    metrics: {
      pages: {
        metric: 'IBM.Automation.Instana.monthly.revenue.1.0.1',
        granularity: 0,
        aggregation: 'SUM'
      }
    }
  };

  return getTopPagesForWebsites(query);
}
