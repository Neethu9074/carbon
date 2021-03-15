/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import TimeThresholdConfigPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/TimeThresholdConfigPresenter';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/formData';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import connectTo from 'in-hoc/connectTo';

const twentyFourHours = 86400000;

export default connectTo(props => ({
  uniqueUsersOrSessionsResult:
    props.form.get('timeThreshold').get('type').value === timeThresholdTypes.userImpactOfViolationsInSequence &&
    getWebsiteMetrics({
      timeConfig: { windowSize: twentyFourHours },
      tagFilterExpression: tagFilter('beacon.website.id', EQUALS, props.form.get('websiteId').value),
      metrics: {
        count: {
          metric: 'uniqueUsersOrSessions',
          aggregation: 'DISTINCT_COUNT'
        }
      }
    })
}))(TimeThresholdConfigPresenter);
