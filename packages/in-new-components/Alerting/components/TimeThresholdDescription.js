/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { timeThresholdLabels } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/SelectTimeThreshold';
import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDurationAccurately } from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TimeThresholdDescription.mless';

export default function TimeThresholdDescription({ timeThreshold }) {
  return (
    <div className={locals.container}>
      <SvgIcon className={locals.icon} type={getIconType(timeThreshold.type)} />
      <div>
        <span className={locals.label}>{timeThresholdLabels[timeThreshold.type]}</span>
        <p>{getDescription(timeThreshold)}</p>
      </div>
    </div>
  );
}

TimeThresholdDescription.propTypes = {
  timeThreshold: PropTypes.object.isRequired
};

function getIconType(timeThresholdType) {
  switch (timeThresholdType) {
    case 'userImpactOfViolationsInSequence':
      return 'lib_alerts_user_impacted';
    case 'requestImpact':
      return 'lib_application_boundary_inbound_calls';
    case 'violationsInPeriod':
      return 'lib_alerting_threshold_icon';
    case 'violationsInSequence':
    default:
      return 'lib_datetime_timerange';
  }
}

function getDescription(timeThreshold) {
  const formattedTimeWindow = formatDurationAccurately(timeThreshold.timeWindow, 60000, false);
  switch (timeThreshold.type) {
    case 'userImpactOfViolationsInSequence': {
      const users = timeThreshold.users;
      const userPercentage = timeThreshold.userPercentage;
      const userImpactList = [];
      if (users) {
        userImpactList.push(`${users} ${users === 1 ? 'user' : 'users'}`);
      }
      if (userPercentage) {
        userImpactList.push(`${percentageZeroDecimalPlaces(userPercentage)} of users`);
      }
      return `At least ${userImpactList.join(' and ')} impacted within ${formattedTimeWindow}`;
    }
    case 'requestImpact': {
      const requests = timeThreshold.requests;
      return `At least ${requests} ${requests === 1 ? 'request' : 'requests'} impacted within ${formattedTimeWindow}`;
    }
    case 'violationsInPeriod': {
      const violations = timeThreshold.violations;
      return `At least ${violations} ${violations === 1 ? 'violation' : 'violations'} within ${formattedTimeWindow}`;
    }
    case 'violationsInSequence':
    default:
      return formattedTimeWindow;
  }
}
