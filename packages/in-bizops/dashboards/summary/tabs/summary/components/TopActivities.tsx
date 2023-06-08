/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error Could not find a declaration file for module
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
// @ts-expect-error Could not find a declaration file for module
import { TopListWithUrlState } from 'in-components/TopListWithUrlState';
import getBusinessActivityList from 'in-bizops/subscriptions/getBusinessActivityList';
import { BusinessActivityItem, TagFilterExpression, TimeConfig } from 'in-types';
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
}

export default function TopActivities({ businessProcessId }: TopActivitiesProps) {
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
      getList={getList}
      Renderer={TopListCardPresenter}
      Label={Label}
    />
  );
}

//TODO: Link to the activities tab when the 'view all activities' button is clicked
// Still waiting on the activities tab to be implemented first :)
function ViewAll() {
  //return <div>{t('in-bizops:dashboards.summary.widgets.viewAll')}</div>;
  return '';
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
        name: 'process_id',
        operator: 'EQUALS',
        value: businessProcessId,
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
      count: {
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

/* TODO: Once the individual business activity dashboard is ready,
revisit this to turn the activity name into a link to the dashboard */
// Forms each row in the activities chart, including the URL.
// item is each element returned from the query made in getList
function Label({ item }: LabelProps) {
  const activityName = item.businessActivity?.activityName;
  return <div>{activityName}</div>;
}
