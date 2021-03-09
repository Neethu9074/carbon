/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import { getValueRoundedToDecimals } from 'in-alerting/smart-alerts/components/utils/formatUtils';
/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';

export function getTitle({ rule, threshold }) {
  const { operator } = threshold;
  const { alertType, aggregation } = rule;

  switch (alertType) {
    case 'errorRate':
      return t('in-alerting:potentialProblems.titleErrorRate');
    case 'slowness':
      return t('in-alerting:potentialProblems.titleSlowness', { aggregation: aggregation });
    case 'throughput': {
      const isGreaterOp = isGreaterOperator(operator);
      return isGreaterOp
        ? t('in-alerting:potentialProblems.titlethroughputHigh')
        : t('in-alerting:potentialProblems.titlethroughputLow');
    }
  }
}

export function getDescription({ rule, threshold, alertType }) {
  const { aggregation } = rule;
  const { operator, type, value } = threshold;

  switch (alertType) {
    case 'errorRate': {
      return getErrorRateHigherOrLowerOperatorText(operator, getValueRoundedToDecimals(value, true));
    }
    case 'slowness': {
      if (type === 'staticThreshold') {
        return getSlownessStaticThresholdSlowerOrBelowOperatorText(
          operator,
          parseInt(value),
          getAggregationText(aggregation)
        );
      }
      return getSlownessSlowerOrBelowOperatorText(operator, getAggregationText(aggregation));
    }
    case 'throughput': {
      if (type === 'staticThreshold') {
        return getThroughputStaticThresholdHigherOrLowerOperatorText(operator, parseInt(value));
      }
      return getThroughputHigherOrLowerOperatorText(operator);
    }
  }
}

function getErrorRateHigherOrLowerOperatorText(operator, callRate) {
  switch (operator) {
    case '>':
      return t('in-alerting:potentialProblems.descriptionErrorIsHigherThan', { callRate: callRate });
    case '>=':
      return t('in-alerting:potentialProblems.descriptionErrorIsHigherOrEqualTo', { callRate: callRate });
    case '<':
      return t('in-alerting:potentialProblems.descriptionErrorIsLowerThan', { callRate: callRate });
    case '<=':
      return t('in-alerting:potentialProblems.descriptionErrorIsLowerThanOrEqualTo', { callRate: callRate });
    default:
      throw Error(t('in-alerting:potentialProblems.descriptionUnsupportedOperator', { operator: operator }));
  }
}

function getThroughputStaticThresholdHigherOrLowerOperatorText(operator, thresholdValue) {
  switch (operator) {
    case '>':
      return t('in-alerting:potentialProblems.descriptionThroughputStaticThresholdIsHigherThan', {
        thresholdValue: thresholdValue
      });
    case '>=':
      return t('in-alerting:potentialProblems.descriptionThroughputStaticThresholdIsHigherOrEqualTo', {
        thresholdValue: thresholdValue
      });
    case '<':
      return t('in-alerting:potentialProblems.descriptionThroughputStaticThresholdIsLowerThan', {
        thresholdValue: thresholdValue
      });
    case '<=':
      return t('in-alerting:potentialProblems.descriptionThroughputStaticThresholdIsLowerThanOrEqualTo', {
        thresholdValue: thresholdValue
      });
    default:
      throw Error(t('in-alerting:potentialProblems.descriptionUnsupportedOperator', { operator: operator }));
  }
}

function getThroughputHigherOrLowerOperatorText(operator) {
  switch (operator) {
    case '>':
      return t('in-alerting:potentialProblems.descriptionThroughputIsHigherThan');
    case '>=':
      return t('in-alerting:potentialProblems.descriptionThroughputIsHigherOrEqualThan');
    case '<':
      return t('in-alerting:potentialProblems.descriptionThroughputIsLowerThan');
    case '<=':
      return t('in-alerting:potentialProblems.descriptionThroughputIsLowerThanOrEqualTo');
    default:
      throw Error(t('in-alerting:potentialProblems.descriptionUnsupportedOperator', { operator: operator }));
  }
}

function getSlownessStaticThresholdSlowerOrBelowOperatorText(operator, thresholdValue, aggregation) {
  switch (operator) {
    case '>':
      return t('in-alerting:potentialProblems.descriptionSlownessStaticThresholdAreSlowerThan', {
        thresholdValue: thresholdValue,
        aggregation: aggregation
      });
    case '>=':
      return t('in-alerting:potentialProblems.descriptionSlownessStaticThresholdAreSlowerThanOrEqualTo', {
        thresholdValue: thresholdValue,
        aggregation: aggregation
      });
    case '<':
      return t('in-alerting:potentialProblems.descriptionSlownessStaticThresholdAreBelow', {
        thresholdValue: thresholdValue,
        aggregation: aggregation
      });
    case '<=':
      return t('in-alerting:potentialProblems.descriptionSlownessStaticThresholdAreBelowOrEqualTo', {
        thresholdValue: thresholdValue,
        aggregation: aggregation
      });
    default:
      throw Error(t('in-alerting:potentialProblems.descriptionUnsupportedOperator', { operator: operator }));
  }
}

function getSlownessSlowerOrBelowOperatorText(operator, aggregation) {
  switch (operator) {
    case '>':
      return t('in-alerting:potentialProblems.descriptionSlownessAreSlowerThan', { aggregation: aggregation });
    case '>=':
      return t('in-alerting:potentialProblems.descriptionSlownessAreSlowerThanOrEqualTo', {
        aggregation: aggregation
      });
    case '<':
      return t('in-alerting:potentialProblems.descriptionSlownessAreBelow', { aggregation: aggregation });
    case '<=':
      return t('in-alerting:potentialProblems.descriptionSlownessAreBelowOrEqualTo', {
        aggregation: aggregation
      });
    default:
      throw Error(t('in-alerting:potentialProblems.descriptionUnsupportedOperator', { operator: operator }));
  }
}
