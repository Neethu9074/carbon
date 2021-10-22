/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { timeThresholdLabels } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/SelectTimeThreshold';
import { ImpactMeasurementMethods } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/formData';
import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/TimeThresholdDescription.mless';

export default function TimeThresholdDescription({ timeThreshold, granularity }) {
  return (
    <div className={locals.container}>
      <SvgIcon className={locals.icon} type={getIconType(timeThreshold.type)} />
      <div>
        <span className={locals.label}>{timeThresholdLabels[timeThreshold.type]}</span>
        <p>{getDescription(timeThreshold, granularity)}</p>
      </div>
    </div>
  );
}

TimeThresholdDescription.propTypes = {
  granularity: PropTypes.number,
  timeThreshold: PropTypes.object.isRequired
};

function getIconType(timeThresholdType) {
  switch (timeThresholdType) {
    case timeThresholdTypes.userImpactOfViolationsInSequence:
      return 'lib_alerts_user_impacted';
    case timeThresholdTypes.requestImpact:
      return 'lib_application_boundary_inbound_calls';
    case timeThresholdTypes.violationsInPeriod:
      return 'lib_alerting_threshold_icon';
    case timeThresholdTypes.violationsInSequence:
    default:
      return 'lib_datetime_timerange';
  }
}

function getDescription(timeThreshold, granularity) {
  const { users, userPercentage, requests, timeWindow, type, violations, impactMeasurementMethod } = timeThreshold;
  const perWindowEvaluation = impactMeasurementMethod === ImpactMeasurementMethods.PER_WINDOW;
  const formattedTimeWindow = formatDurationAccurately(timeWindow, 60000, false);
  switch (type) {
    case timeThresholdTypes.userImpactOfViolationsInSequence: {
      if (users && userPercentage) {
        if (perWindowEvaluation)
          return t(
            'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionUserImpactOfViolationsInSequenceUserAndUserPercentage_perWindowEvaluation',
            {
              count: users,
              userPercentage: percentageZeroDecimalPlaces(userPercentage),
              numberEvaluationWindows: timeWindow / granularity
            }
          );
        return t(
          'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionUserImpactOfViolationsInSequenceUserAndUserPercentage',
          {
            count: users,
            userPercentage: percentageZeroDecimalPlaces(userPercentage),
            formattedTimeWindow
          }
        );
      } else if (users) {
        if (perWindowEvaluation)
          return t(
            'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionUserImpactOfViolationsInSequenceUser_perWindowEvaluation',
            {
              count: users,
              numberEvaluationWindows: timeWindow / granularity
            }
          );
        return t(
          'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionUserImpactOfViolationsInSequenceUser',
          {
            count: users,
            formattedTimeWindow
          }
        );
      } else if (userPercentage) {
        if (perWindowEvaluation)
          return t(
            'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionUserImpactOfViolationsInSequenceUserPercentage_perWindowEvaluation',
            {
              userPercentage: percentageZeroDecimalPlaces(userPercentage),
              numberEvaluationWindows: timeWindow / granularity
            }
          );
        return t(
          'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionUserImpactOfViolationsInSequenceUserPercentage',
          { userPercentage: percentageZeroDecimalPlaces(userPercentage), formattedTimeWindow }
        );
      } else {
        if (perWindowEvaluation)
          return t(
            'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionUserImpactOfViolationsInSequence_perWindowEvaluation',
            {
              numberEvaluationWindows: timeWindow / granularity
            }
          );
        return t(
          'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionUserImpactOfViolationsInSequence',
          {
            formattedTimeWindow
          }
        );
      }
    }
    case timeThresholdTypes.requestImpact: {
      return t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionRequestImpact', {
        count: requests,
        formattedTimeWindow
      });
    }
    case timeThresholdTypes.violationsInPeriod: {
      return t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionViolationsInPeriod', {
        count: violations,
        formattedTimeWindow
      });
    }
    case timeThresholdTypes.violationsInSequence:
    default:
      return formattedTimeWindow;
  }
}
