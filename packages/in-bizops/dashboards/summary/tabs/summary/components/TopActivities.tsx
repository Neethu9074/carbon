/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link } from '@instana/components';

import {
  businessProcessActivityListPath,
  businessActivityPath,
  businessActivitySummaryPath,
  businessProcessDashboard
} from 'in-bizops/navigation/paths';
// @ts-expect-error Could not find a declaration file for module
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
// @ts-expect-error Could not find a declaration file for module
import { TopListWithUrlState } from 'in-components/TopListWithUrlState';
import { clickBizopsProcessViewAllActivitiesTracker, selectBizopsProcessActivitiesTracker } from 'in-bizops/tracker';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import getBusinessActivities from 'in-bizops/subscriptions/getBusinessActivities';
import { BusinessActivityItem, TagFilterExpression, TimeConfig } from 'in-types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
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
      //labels={''}
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
  const { location, createHrefToPath } = useNavigation();

  const businessProcessId: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionId') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionName') ??
    t('in-bizops:dashboards.summary.pageTitle');

  const processTracking = {
    processId: businessProcessId,
    processName: businessProcessName
  };

  const viewAllPath: string = createHrefToPath(businessProcessActivityListPath);
  return (
    <Link
      className={className}
      href={viewAllPath}
      onClick={() => clickBizopsProcessViewAllActivitiesTracker(processTracking)}
    >
      {t('in-bizops:dashboards.summary.widgets.viewAll')}
    </Link>
  );
}

type GetListProps = {
  businessProcessId: string;
  timeConfig: TimeConfig;
};

// Invoke the websocket to fetch business activity list data from backend
function getList({ businessProcessId, timeConfig }: GetListProps) {
  const tagFilterExpression: TagFilterExpression = {
    logicalOperator: 'AND',
    type: 'EXPRESSION',
    elements: [
      {
        entity: 'SOURCE',
        name: 'bpm_process_definition_id',
        operator: 'EQUALS',
        value: businessProcessId,
        type: 'TAG_FILTER'
      }
    ]
  };

  // @ts-ignore  TODO:  remove this ignore once the BusinessDataQuery type has been re-generated
  return getBusinessActivities({
    dataType: 'ACTIVITY',
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
    timeConfig,
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
  let activityName: string;
  if (item.businessActivity?.activityName) {
    activityName = item.businessActivity?.activityName;
  } else if (item.businessActivity?.activityType) {
    activityName = t('in-bizops:lists.unnamedActivity', { activityType: item.businessActivity?.activityType });
  } else {
    activityName = t('in-bizops:lists.unnamedActivity');
  }

  const businessProcessId: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionId') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionName') ??
    t('in-bizops:dashboards.summary.pageTitle');

  const activityTracking = {
    processId: businessProcessId,
    processName: businessProcessName,
    activityName: activityName
  };

  location.pathname = businessActivitySummaryPath;
  setOrDeleteMatrixKey(location, businessActivityPath, 'activityName', activityName);

  return (
    <Link href={createHref(location)} onClick={() => selectBizopsProcessActivitiesTracker(activityTracking)}>
      {activityName}
    </Link>
  );
}
