/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { timeThresholdLabels } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/SelectTimeThreshold';
import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDurationAccurately } from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/TimeThresholdDescription.mless';

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

      if (users && userPercentage) {
        return t(
          'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionUserImpactOfViolationsInSequenceUserAndUserPercentage',
          {
            count: users,
            userPercentage: percentageZeroDecimalPlaces(userPercentage),
            formattedTimeWindow: formattedTimeWindow
          }
        );
      } else if (users) {
        return t(
          'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionUserImpactOfViolationsInSequenceUser',
          {
            count: users,
            formattedTimeWindow: formattedTimeWindow
          }
        );
      } else if (userPercentage) {
        return t(
          'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionUserImpactOfViolationsInSequenceUserPercentage',
          { userPercentage: percentageZeroDecimalPlaces(userPercentage), formattedTimeWindow: formattedTimeWindow }
        );
      } else {
        return t(
          'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionUserImpactOfViolationsInSequence',
          {
            formattedTimeWindow: formattedTimeWindow
          }
        );
      }
    }
    case 'requestImpact': {
      const requests = timeThreshold.requests;
      return t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionRequestImpact', {
        count: requests,
        formattedTimeWindow: formattedTimeWindow
      });
    }
    case 'violationsInPeriod': {
      const violations = timeThreshold.violations;
      return t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionViolationsInPeriod', {
        count: violations,
        formattedTimeWindow: formattedTimeWindow
      });
    }
    case 'violationsInSequence':
    default:
      return formattedTimeWindow;
  }
}
