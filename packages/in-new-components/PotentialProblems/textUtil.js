/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { getValueRoundedToDecimals } from 'in-new-components/Alerting/utils/formatUtils';
import { getAggregationText } from 'in-new-components/Alerting/utils/formUtils';
import { isGreaterOperator } from 'in-new-components/Alerting/utils/alertUtils';

export function getTitle({ rule, threshold }) {
  const { operator } = threshold;
  const { alertType, aggregation } = rule;

  switch (alertType) {
    case 'errorRate':
      return t('in-new-components:potentialProblems.titleErrorRate');
    case 'slowness':
      return t('in-new-components:potentialProblems.titleSlowness', { aggregation: aggregation });
    case 'throughput': {
      const isGreaterOp = isGreaterOperator(operator);
      return isGreaterOp
        ? t('in-new-components:potentialProblems.titlethroughputHigh')
        : t('in-new-components:potentialProblems.titlethroughputLow');
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
      return t('in-new-components:potentialProblems.descriptionErrorIsHigherThan', { callRate: callRate });
    case '>=':
      return t('in-new-components:potentialProblems.descriptionErrorIsHigherOrEqualTo', { callRate: callRate });
    case '<':
      return t('in-new-components:potentialProblems.descriptionErrorIsLowerThan', { callRate: callRate });
    case '<=':
      return t('in-new-components:potentialProblems.descriptionErrorIsLowerThanOrEqualTo', { callRate: callRate });
    default:
      throw Error(t('in-new-components:potentialProblems.descriptionUnsupportedOperator', { operator: operator }));
  }
}

function getThroughputStaticThresholdHigherOrLowerOperatorText(operator, thresholdValue) {
  switch (operator) {
    case '>':
      return t('in-new-components:potentialProblems.descriptionThroughputStaticThresholdIsHigherThan', {
        thresholdValue: thresholdValue
      });
    case '>=':
      return t('in-new-components:potentialProblems.descriptionThroughputStaticThresholdIsHigherOrEqualTo', {
        thresholdValue: thresholdValue
      });
    case '<':
      return t('in-new-components:potentialProblems.descriptionThroughputStaticThresholdIsLowerThan', {
        thresholdValue: thresholdValue
      });
    case '<=':
      return t('in-new-components:potentialProblems.descriptionThroughputStaticThresholdIsLowerThanOrEqualTo', {
        thresholdValue: thresholdValue
      });
    default:
      throw Error(t('in-new-components:potentialProblems.descriptionUnsupportedOperator', { operator: operator }));
  }
}

function getThroughputHigherOrLowerOperatorText(operator) {
  switch (operator) {
    case '>':
      return t('in-new-components:potentialProblems.descriptionThroughputIsHigherThan');
    case '>=':
      return t('in-new-components:potentialProblems.descriptionThroughputIsHigherOrEqualThan');
    case '<':
      return t('in-new-components:potentialProblems.descriptionThroughputIsLowerThan');
    case '<=':
      return t('in-new-components:potentialProblems.descriptionThroughputIsLowerThanOrEqualTo');
    default:
      throw Error(t('in-new-components:potentialProblems.descriptionUnsupportedOperator', { operator: operator }));
  }
}

function getSlownessStaticThresholdSlowerOrBelowOperatorText(operator, thresholdValue, aggregation) {
  switch (operator) {
    case '>':
      return t('in-new-components:potentialProblems.descriptionSlownessStaticThresholdAreSlowerThan', {
        thresholdValue: thresholdValue,
        aggregation: aggregation
      });
    case '>=':
      return t('in-new-components:potentialProblems.descriptionSlownessStaticThresholdAreSlowerThanOrEqualTo', {
        thresholdValue: thresholdValue,
        aggregation: aggregation
      });
    case '<':
      return t('in-new-components:potentialProblems.descriptionSlownessStaticThresholdAreBelow', {
        thresholdValue: thresholdValue,
        aggregation: aggregation
      });
    case '<=':
      return t('in-new-components:potentialProblems.descriptionSlownessStaticThresholdAreBelowOrEqualTo', {
        thresholdValue: thresholdValue,
        aggregation: aggregation
      });
    default:
      throw Error(t('in-new-components:potentialProblems.descriptionUnsupportedOperator', { operator: operator }));
  }
}

function getSlownessSlowerOrBelowOperatorText(operator, aggregation) {
  switch (operator) {
    case '>':
      return t('in-new-components:potentialProblems.descriptionSlownessAreSlowerThan', { aggregation: aggregation });
    case '>=':
      return t('in-new-components:potentialProblems.descriptionSlownessAreSlowerThanOrEqualTo', {
        aggregation: aggregation
      });
    case '<':
      return t('in-new-components:potentialProblems.descriptionSlownessAreBelow', { aggregation: aggregation });
    case '<=':
      return t('in-new-components:potentialProblems.descriptionSlownessAreBelowOrEqualTo', {
        aggregation: aggregation
      });
    default:
      throw Error(t('in-new-components:potentialProblems.descriptionUnsupportedOperator', { operator: operator }));
  }
}
