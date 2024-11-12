/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEmpty } from 'lodash';

import {
  PER_AP,
  PER_AP_ENDPOINT,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import {
  getLogLevelRuleOperatorLabel,
  getStatusCodeLabel
} from 'in-alerting/smart-alerts/applications/form/ruleFormData';
import { getHigherOrLowerOperatorContext } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { isEmpty as checkIsEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { getValueRoundedToDecimals } from 'in-alerting/smart-alerts/components/utils/formatUtils';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { MAX_LABEL_LENGTH } from 'in-alerting/formFieldLengths';
import { operators } from 'in-analyze/applicationFilter';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

const operatorDescriptionContextValues = {
  [operators.EQUALS]: 'equal',
  [operators.CONTAINS]: 'contain',
  [operators.STARTS_WITH]: 'start',
  [operators.ENDS_WITH]: 'end'
};

export function getMetricUnitPostfix(metricName) {
  switch (metricName) {
    case 'latency':
      return 'ms';
    case 'errors':
    case 'callRate':
      return '%';
    default:
      return '';
  }
}

export function getTitlePlaceholder(form) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  switch (alertType) {
    case 'errors': {
      const metricName = ruleForm.get('metricName').value;
      const percentageMetric = isPercentageMetric(metricName);
      return percentageMetric
        ? t('in-alerting:smartAlerts.applications.formUtils.titlePlaceholder.errorRate')
        : t('in-alerting:smartAlerts.applications.formUtils.titlePlaceholder.errorCount');
    }
    case 'slowness':
      return t('in-alerting:smartAlerts.applications.formUtils.titlePlaceholder.slowness');
    case 'logs': {
      const message = ruleForm.get('message').value;
      const ruleOperator = ruleForm.get('operator').value;
      const level = ruleForm.get('level').value;

      if (ruleOperator === operators.NOT_EMPTY) {
        if (level === 'ANY') {
          return t('in-alerting:smartAlerts.applications.formUtils.titlePlaceholder.logs.notEmptyWithANY');
        }
        return t('in-alerting:smartAlerts.applications.formUtils.titlePlaceholder.logs.notEmptyWithoutANY', {
          operatorLabel: getLogLevelRuleOperatorLabel(level)
        });
      }

      if (level === 'ANY') {
        return t('in-alerting:smartAlerts.applications.formUtils.titlePlaceholder.logs.withANY', {
          message: message
        });
      }
      return t('in-alerting:smartAlerts.applications.formUtils.titlePlaceholder.logs.default', {
        operatorLabel: getLogLevelRuleOperatorLabel(level),
        message: message
      });
    }
    case 'statusCode': {
      const statusCodeStart = ruleForm.get('statusCode').get('statusCodeStart').value;
      const statusCodeEnd = ruleForm.get('statusCode').get('statusCodeEnd').value;
      return t('in-alerting:smartAlerts.applications.formUtils.titlePlaceholder.statusCode', {
        statusCodeShortText: getStatusCodeShortText(statusCodeStart, statusCodeEnd)
      });
    }
    case 'throughput': {
      const thresholdOperator = form.get('threshold').get('operator').value;
      const isGreaterOp = isGreaterOperator(thresholdOperator);
      return isGreaterOp
        ? t('in-alerting:smartAlerts.applications.formUtils.titlePlaceholder.throughputHigh')
        : t('in-alerting:smartAlerts.applications.formUtils.titlePlaceholder.throughputLow');
    }
    default:
      throw Error('Unsupported alertType: ' + alertType);
  }
}

export function getDescriptionPlaceholder(form, severity) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const thresholdForm = form.get('threshold');
  const thresholdOperator = thresholdForm.get('operator').value;
  const thresholdType = thresholdForm.get('warningThreshold').get('type').value;
  const isMultiThresholdConfigured =
    !checkIsEmpty(thresholdForm?.get('warningThreshold')?.get('value')?.value) &&
    !checkIsEmpty(thresholdForm?.get('criticalThreshold')?.get('value')?.value);

  switch (alertType) {
    case 'errors': {
      const metricName = ruleForm.get('metricName').value;
      const percentageMetric = isPercentageMetric(metricName);

      // If both warning and critical thresholds are configured, we display a generic message instead of specifying the values defined for both thresholds.
      if (thresholdType === STATIC_THRESHOLD && !isMultiThresholdConfigured) {
        const thresholdValue = getThresholdValue(thresholdForm, severity);
        return t(
          percentageMetric
            ? 'in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.errorRateStaticThreshold'
            : 'in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.errorCountStaticThreshold',
          {
            context: getHigherOrLowerOperatorContext(thresholdOperator),
            valueRoundedToDecimals: getValueRoundedToDecimals(thresholdValue, percentageMetric)
          }
        );
      }
      return t(
        percentageMetric
          ? 'in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.errorRateDefault'
          : 'in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.errorCountDefault',
        {
          context: getHigherOrLowerOperatorContext(thresholdOperator)
        }
      );
    }
    case 'slowness': {
      const aggregation = ruleForm.get('aggregation').value;

      if (thresholdType === STATIC_THRESHOLD && !isMultiThresholdConfigured) {
        const thresholdValue = getThresholdValue(thresholdForm, severity);
        return t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.slownessStaticThreshold', {
          context: getSlowerOrBelowOperatorContext(thresholdOperator),
          thresholdValue: thresholdValue,
          aggregationText: getAggregationText(aggregation)
        });
      }
      return t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.slownessDefault', {
        context: getSlowerOrBelowOperatorContext(thresholdOperator),
        aggregationText: getAggregationText(aggregation)
      });
    }
    case 'logs': {
      const message = ruleForm.get('message').value;
      const ruleOperator = ruleForm.get('operator').value;
      const level = ruleForm.get('level').value;
      const levelText = getLogLevelRuleOperatorLabel(level);

      const thresholdValue = getThresholdValue(thresholdForm, severity);
      if (ruleOperator === operators.NOT_EMPTY) {
        return t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.logsNotEmpty', {
          context: getHigherOrLowerOperatorContext(thresholdOperator),
          levelText: levelText,
          thresholdValue: isMultiThresholdConfigured
            ? t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.expected')
            : thresholdValue
        });
      }
      return t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.logsDefault', {
        context: getHigherOrLowerOperatorDescriptionContext(
          operatorDescriptionContextValues[ruleOperator],
          thresholdOperator
        ),
        levelText: levelText,
        message: message,
        thresholdValue: isMultiThresholdConfigured
          ? t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.expected')
          : thresholdValue
      });
    }
    case 'statusCode': {
      const statusCodeStart = ruleForm.get('statusCode').get('statusCodeStart').value;
      const statusCodeEnd = ruleForm.get('statusCode').get('statusCodeEnd').value;
      const statusCodeFullText = getStatusCodeFullText(statusCodeStart, statusCodeEnd);
      const metricName = ruleForm.get('metricName').value;
      const percentageMetric = isPercentageMetric(metricName);
      if (thresholdType === STATIC_THRESHOLD && !isMultiThresholdConfigured) {
        const thresholdValue = getThresholdValue(thresholdForm, severity);
        return t(
          percentageMetric
            ? 'in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.statusCodeRateStaticThreshold'
            : 'in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.statusCodeStaticThreshold',
          {
            context: getHigherOrLowerOperatorContext(thresholdOperator),
            statusCodeFullText,
            thresholdValue: getValueRoundedToDecimals(thresholdValue, percentageMetric)
          }
        );
      }

      return t(
        percentageMetric
          ? 'in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.statusCodeRateDefault'
          : 'in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.statusCodeDefault',
        {
          context: getHigherOrLowerOperatorContext(thresholdOperator),
          statusCodeFullText
        }
      );
    }
    case 'throughput': {
      if (thresholdType === STATIC_THRESHOLD && !isMultiThresholdConfigured) {
        const thresholdValue = getThresholdValue(thresholdForm, severity);
        return t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.throughputStaticThreshold', {
          context: getHigherOrLowerOperatorContext(thresholdOperator),
          thresholdValue: thresholdValue
        });
      }
      return t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.throughputDefault', {
        context: getHigherOrLowerOperatorContext(thresholdOperator)
      });
    }
    default:
      throw Error('Unsupported alertType: ' + alertType);
  }
}

function getStatusCodeShortText(statusCodeStart, statusCodeEnd) {
  if (statusCodeStart && statusCodeStart === statusCodeEnd) {
    return statusCodeStart.toString();
  } else if (
    statusCodeStart &&
    statusCodeEnd &&
    statusCodeStart % 100 === 0 &&
    statusCodeEnd - statusCodeStart === 99
  ) {
    // predefined ranges (e.g. 400 - 499): 4XX
    return `${parseInt(statusCodeStart / 100).toString()}XX`;
  } else {
    // custom ranges
    return `${statusCodeStart ?? '?'} - ${statusCodeEnd ?? '?'}`;
  }
}

function getStatusCodeFullText(statusCodeStart, statusCodeEnd) {
  if (statusCodeStart && statusCodeStart === statusCodeEnd) {
    return getStatusCodeLabel(statusCodeStart.toString());
  } else if (
    statusCodeStart &&
    statusCodeEnd &&
    statusCodeStart % 100 === 0 &&
    statusCodeEnd - statusCodeStart === 99
  ) {
    // predefined ranges (e.g. 400 - 499): 4XX
    return getStatusCodeLabel(parseInt(statusCodeStart / 100).toString());
  } else {
    // custom ranges
    return t('in-alerting:smartAlerts.applications.formUtils.customStatusCodeFullText', {
      statusCodeStart: statusCodeStart ?? '?',
      statusCodeEnd: statusCodeEnd ?? '?'
    });
  }
}

function getSlowerOrBelowOperatorContext(operator) {
  switch (operator) {
    case '>':
      // "slower than"
      return 'slowerThan';
    case '>=':
      // "slower or equal to"
      return 'slowEqual';
    case '<':
      // "below"
      return 'below';
    case '<=':
      // "below or equal to"
      return 'belowEqual';
    default:
      throw Error('Unsupported operator: ' + operator);
  }
}

function getHigherOrLowerOperatorDescriptionContext(operatorDescription, operator) {
  let returnContext = operatorDescription;
  switch (operator) {
    case '>':
      // "higher than"
      return returnContext + 'HigherThan';
    case '>=':
      // "higher or equal to"
      return returnContext + 'HigherEqual';
    case '<':
      // "lower than"
      return returnContext + 'LowerThan';
    case '<=':
      // "lower or equal to"
      return returnContext + 'LowerEqual';
    default:
      throw Error('Unsupported operator: ' + operator);
  }
}

export function getThresholdValue(thresholdForm, severity) {
  return severity == 5
    ? thresholdForm?.get('warningThreshold')?.get('value')?.value
    : thresholdForm?.get('criticalThreshold')?.get('value')?.value;
}

export function isEntitySelectionValid(entitySelection, isGlobalAlert) {
  if (isGlobalAlert) {
    return true;
  }

  const hasAtLeastOneValidApplicationSelection = Object.values(entitySelection ?? {}).some(
    ({ inclusive, services }) => {
      return inclusive === true || !isEmpty(services);
    }
  );

  return entitySelection !== undefined && hasAtLeastOneValidApplicationSelection;
}

export function isValidChartViewEntitySelection(evaluationType, chartViewEntitySelection) {
  const { applicationId, serviceId, endpointId } = chartViewEntitySelection;

  return (
    (evaluationType === PER_AP && applicationId) ||
    (evaluationType === PER_AP_SERVICE && applicationId && serviceId) ||
    (evaluationType === PER_AP_ENDPOINT && applicationId && serviceId && endpointId)
  );
}

export function isPercentageMetric(metricName) {
  return metricName === 'callRate' || metricName === 'errors';
}

export function titleValidator() {
  return value => {
    if (typeof value === 'string' && value.length > MAX_LABEL_LENGTH) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.valueMustBeShorterThanMaxLengthCharacters', {
            maxLength: MAX_LABEL_LENGTH
          })
        }
      ];
    } else if (value == null || (typeof value === 'string' && isBlank(value))) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.theValueMustNotBeBlank')
        }
      ];
    }
    return null;
  };
}
