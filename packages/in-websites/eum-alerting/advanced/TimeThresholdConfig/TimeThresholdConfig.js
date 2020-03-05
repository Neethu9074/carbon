import PropTypes from 'prop-types';
import { get } from 'lodash';
import React from 'react';

import ConfigureAlertingThreshold from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/ConfigureAlertingThreshold';
import SelectThreshold from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/SelectThreshold';
import { fieldNames, radioOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import TwoColumnContainer from 'in-websites/eum-alerting/advanced/components/TwoColumnContainer';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

export default connectTo(props => ({
  uniqueUsersOrSessionsResult:
    props.form.get(fieldNames.timeThresholdType).value ===
      radioOptions.timeThresholdType.userImpactOfViolationsInSequence &&
    getWebsiteMetrics({
      timeConfig: { windowSize: 86400000 },
      tagFilters: [
        { name: 'beacon.website.id', operator: 'EQUALS', stringValue: props.form.get(fieldNames.websiteId).value }
      ],
      metrics: {
        count: {
          metric: 'uniqueUsersOrSessions',
          aggregation: 'DISTINCT_COUNT'
        }
      }
    })
}))(TimeThresholdConfig);

function TimeThresholdConfig({ form, onChange, uniqueUsersOrSessionsResult }) {
  return (
    <TwoColumnContainer
      moveMainAreaRight
      mainContentHeadline={getTitle(form)}
      mainContent={<ConfigureAlertingThreshold form={form} onChange={onChange} />}
      secondaryContent={<SelectThreshold form={form} onChange={onChange} />}
      warnMessage={
        get(uniqueUsersOrSessionsResult, ['data', 'count', 0, 1]) === 0 && (
          <>
            No{' '}
            <Link external href="https://docs.instana.io/products/website_monitoring/api/#identifying-users">
              users
            </Link>{' '}
            or{' '}
            <Link external href="https://docs.instana.io/products/website_monitoring/api/#session-tracking">
              sessions
            </Link>{' '}
            detected. <br />
            Please configure website monitoring before using this option.
          </>
        )
      }
      removePaddingSecondaryArea
    />
  );
}

function getTitle(form) {
  const { violationsInSequence, violationsInPeriod, userImpactOfViolationsInSequence } = radioOptions.timeThresholdType;
  const timeThresholdType = form.get(fieldNames.timeThresholdType).value;
  switch (timeThresholdType) {
    case violationsInSequence:
      return 'Persistence over time';
    case violationsInPeriod:
      return 'Number of violations over time';
    case userImpactOfViolationsInSequence:
      return 'User impact';
  }
}

TimeThresholdConfig.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  uniqueUsersOrSessionsResult: PropTypes.object
};
