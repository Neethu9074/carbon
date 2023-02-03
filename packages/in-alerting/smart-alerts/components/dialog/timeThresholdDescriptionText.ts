/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  ApplicationTimeThreshold,
  TraceImpactApplicationTimeThreshold,
  UserImpactWebsiteTimeThreshold,
  ViolationsInPeriodWebsiteTimeThreshold,
  WebsiteTimeThreshold
} from 'in-types';
import { ImpactMeasurementMethods } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { t } from 'in-i18n';

/**
 * Returns the description string of the given TimeThreshold.
 *
 * @param timeThreshold either a Websites- or Applications specific TimeThreshold
 * @param granularity - required, when timeThreshold is of type UserImpactWebsiteTimeThreshold and for perWindowEvaluation
 */
export function getDescription(
  timeThreshold: WebsiteTimeThreshold | ApplicationTimeThreshold,
  granularity: number
): string {
  const { type, timeWindow } = timeThreshold;

  const formattedTimeWindow = formatDurationAccurately(timeWindow, 60000, false);

  switch (type) {
    case timeThresholdTypes.userImpactOfViolationsInSequence: {
      const {
        users,
        userPercentage,
        timeWindow,
        impactMeasurementMethod
      } = timeThreshold as UserImpactWebsiteTimeThreshold;
      const perWindowEvaluation = impactMeasurementMethod === ImpactMeasurementMethods.PER_WINDOW;

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
    case timeThresholdTypes.traceImpact: {
      const { requests } = timeThreshold as TraceImpactApplicationTimeThreshold;

      return t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionTraceImpact', {
        count: requests,
        formattedTimeWindow
      });
    }
    case timeThresholdTypes.violationsInPeriod: {
      const { violations } = timeThreshold as ViolationsInPeriodWebsiteTimeThreshold;

      return t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdDescriptionViolationsInPeriod', {
        count: violations,
        formattedTimeWindow
      });
    }
    case timeThresholdTypes.violationsInSequence:
    default:
      return formattedTimeWindow ?? '';
  }
}
