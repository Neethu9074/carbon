/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';

//@ts-expect-error
import TimeThresholdConfigPresenter from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfigPresenter';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import getMobileAppMetrics from 'in-mobile-apps/subscriptions/getMobileAppMetrics';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
//@ts-expect-error
import connectTo from 'in-hoc/connectTo';

const twentyFourHours = 86400000;

interface connectToProp {
  form: MapForm<any>;
}

export default connectTo((props: connectToProp) => ({
  uniqueUsersOrSessionsResult:
    props.form.get('timeThreshold').get('type').value === timeThresholdTypes.userImpactOfViolationsInSequence &&
    getMobileAppMetrics({
      timeConfig: { windowSize: twentyFourHours, autoRefresh: false },
      timeShift: { offset: 0 },
      tagFilterExpression: tagFilter('mobileBeacon.mobileApp.id', EQUALS, props.form.get('mobileAppId').value),
      metrics: {
        count: {
          metric: 'uniqueUsers',
          aggregation: 'DISTINCT_COUNT'
        }
      }
    })
}))(TimeThresholdConfigPresenter);
