/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
// @ts-expect-error Could not find a declaration file for module
import { TopListWithUrlState } from 'in-components/TopListWithUrlState';
import { businessActivityServiceListPath, businessActivitySummaryPath } from 'in-bizops/navigation/paths';
import getActivityServices from 'in-bizops/subscriptions/getActivityServices';
import { useLinkToServiceDashboard } from 'in-applications/navigation/paths';
import { millis, number, percentage } from 'in-services/formatters/number';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Service, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface TopServicesProps {
  businessActivityId: string;
  businessProcessDefinitionId: string;
}

const labels = [
  t('in-bizops:dashboards.summary.widgets.processLatency'),
  t('in-bizops:dashboards.summary.widgets.processCalls'),
  t('in-bizops:dashboards.summary.widgets.processErroneous')
];

// This chart displays the top services within an activity
export default function TopServices({ businessActivityId, businessProcessDefinitionId }: TopServicesProps) {
  const timeConfig = useTimeConfig();
  return (
    <TopListWithUrlState
      metrics={['latency', 'calls', 'errors']}
      title={t('in-bizops:dashboards.activity.widgets.topServices')}
      labels={labels}
      formatters={[millis.fixedCompact, number.compact, percentage.detailed]}
      ViewAll={ViewAll}
      timeConfig={timeConfig}
      businessActivityId={businessActivityId}
      businessProcessDefinitionId={businessProcessDefinitionId}
      getList={getList}
      Renderer={TopListCardPresenter}
      Label={Label}
      urlMatrixParamConfig={{ path: businessActivitySummaryPath, paramTab: 'latencyTab' }}
    />
  );
}

interface viewAllProps {
  className: string;
}

// className styling provided by chart component
function ViewAll({ className }: viewAllProps) {
  const { createHrefToPath } = useNavigation();

  const viewAllPath: string = createHrefToPath(businessActivityServiceListPath);
  return (
    <Link className={className} href={viewAllPath}>
      {t('in-bizops:dashboards.activity.widgets.viewAll')}
    </Link>
  );
}

type GetListProps = {
  businessActivityId: string;
  businessProcessDefinitionId: string;
  timeConfig: TimeConfig;
  selectedMetric: string;
};

// Invoke the websocket to fetch business activity service list data from backend
function getList({ businessActivityId, businessProcessDefinitionId, timeConfig, selectedMetric }: GetListProps) {
  return getActivityServices({
    activityId: businessActivityId,
    processDefinitionId: businessProcessDefinitionId,
    serviceMetrics: {
      latency: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN'
      }
    },
    order: {
      by: selectedMetric,
      direction: 'DESC'
    },
    pagination: {
      page: 1,
      pageSize: 5
    },
    timeConfig
  });
}

interface ActivityServiceItem {
  service: Service;
  metrics: { [index: string]: number[][] };
}

type LabelProps = {
  item: ActivityServiceItem;
};

// Forms each row in the service chart, including the URL.
// item is each element returned from the query made in getList
function Label({ item }: LabelProps) {
  const getLinkToServiceDashboard = useLinkToServiceDashboard();

  let serviceName: string;
  if (item.service?.label) {
    serviceName = item.service?.label;
  } else {
    serviceName = t('in-bizops:lists.unnamedService');
  }

  return <Link href={getLinkToServiceDashboard({ serviceId: item.service?.id })}>{serviceName}</Link>;
}
