/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
// @ts-expect-error Could not find a declaration file for module
import { TopListWithUrlState } from 'in-components/TopListWithUrlState';
import { businessActivityDashboardPath, businessActivitySummaryPath } from 'in-bizops/navigation/paths';
import getBusinessActivityList from 'in-bizops/subscriptions/getBusinessActivityList';
import { BusinessActivityItem, TagFilterExpression, TimeConfig } from 'in-types';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { businessProcessActivityListPath } from 'in-bizops/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { bizopsFeatureEnabled } from 'in-services/featureFlags';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

/*
We want to return a chart that shows the top 5 activities of the selected business process
in descending order, by count.

Count is defined as the number of times that the activity has started within the selected
time window.
*/

interface TopActivitiesProps {
  businessProcessId: string;
  businessProcessName: string;
}

export default function TopActivities({ businessProcessId, businessProcessName }: TopActivitiesProps) {
  const timeConfig = useTimeConfig();
  /* TODO: When/if more metrics are added, use the labels prop to supply the
  header tab button labels. Since we're starting with just one metric (count),
  we don't need the labels prop just yet */
  return (
    <TopListWithUrlState
      metrics={['activitiesCount']}
      title={t('in-bizops:dashboards.summary.widgets.topActivities')}
      //labels={[t('in-bizops:dashboards.summary.widgets.count')]}
      formatters={[number.compact]}
      ViewAll={ViewAll}
      timeConfig={timeConfig}
      businessProcessId={businessProcessId}
      businessProcessName={businessProcessName}
      getList={getList}
      Renderer={TopListCardPresenter}
      Label={Label}
    />
  );
}

interface viewAllProps {
  className: string;
}

// className styling provided by chart component
function ViewAll({ className }: viewAllProps) {
  const location = useNavigation();
  // <FEATURE FLAG>
  if (!bizopsFeatureEnabled) {
    return '';
  }
  // </FEATURE FLAG>
  const viewAllPath: string = location.createHrefToPath(businessProcessActivityListPath);
  return (
    <Link className={className} href={viewAllPath}>
      {t('in-bizops:dashboards.summary.widgets.viewAll')}
    </Link>
  );
}

type GetListProps = {
  businessProcessId: string;
  businessProcessName: string;
  timeConfig: TimeConfig;
};

// Invoke the websocket to fetch business activity list data from backend
function getList({ businessProcessId, businessProcessName, timeConfig }: GetListProps) {
  const tagFilterExpression: TagFilterExpression = {
    logicalOperator: 'AND',
    type: 'EXPRESSION',
    elements: [
      {
        entity: 'SOURCE',
        name: 'process_id',
        operator: 'EQUALS',
        value: businessProcessId,
        type: 'TAG_FILTER'
      },
      {
        name: 'bpm_process_definition_name',
        operator: 'EQUALS',
        stringValue: businessProcessName,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      }
    ]
  };

  return getBusinessActivityList({
    filter: {
      timeConfig: timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    metrics: {
      activitiesCount: {
        metric: 'activitiesCount',
        aggregation: 'DISTINCT_COUNT'
      }
    },
    order: {
      by: 'activitiesCount',
      direction: 'DESC'
    },
    pagination: {
      page: 1,
      pageSize: 5
    },
    tagFilterExpression
  });
}

type LabelProps = {
  item: BusinessActivityItem;
};

// Forms each row in the activities chart, including the URL.
// item is each element returned from the query made in getList
function Label({ item }: LabelProps) {
  const { location, createHref } = useNavigation();
  const activityName = item.businessActivity?.activityName;

  if (bizopsFeatureEnabled) {
    location.pathname = businessActivitySummaryPath;
    setOrDeleteMatrixKey(location, businessActivityDashboardPath, 'activityName', activityName);

    return <Link href={createHref(location)}>{activityName}</Link>;
  } else {
    return <div>{activityName}</div>;
  }
}
