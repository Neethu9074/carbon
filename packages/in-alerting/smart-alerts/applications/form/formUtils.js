/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEmpty } from 'lodash';

import {
  getLogLevelRuleOperatorLabel,
  getStatusCodeLabel
} from 'in-alerting/smart-alerts/applications/form/ruleFormData';
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getValueRoundedToDecimals } from 'in-alerting/smart-alerts/components/utils/formatUtils';
import { getAggregationText } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { operators } from 'in-analyze/applicationFilter';
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
      return '%';
    default:
      return '';
  }
}

export function getTitlePlaceholder(form) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  switch (alertType) {
    case 'errorRate':
      return t('in-alerting:smartAlerts.applications.formUtils.titlePlaceholder.errorRate');
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

export function getDescriptionPlaceholder(form) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const thresholdForm = form.get('threshold');
  const thresholdOperator = thresholdForm.get('operator').value;
  const thresholdType = thresholdForm.get('type').value;

  switch (alertType) {
    case 'errorRate': {
      if (thresholdType === ADAPTIVE_BASELINE) {
        // TODO: NEW TEXT NEEDED?
        return '';
      }
      const thresholdValue = thresholdForm.get('value').value;
      return t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.errorRate', {
        context: getHigherOrLowerOperatorContext(thresholdOperator),
        valueRoundedToDecimals: getValueRoundedToDecimals(thresholdValue, true)
      });
    }
    case 'slowness': {
      const aggregation = ruleForm.get('aggregation').value;

      if (thresholdType === STATIC_THRESHOLD) {
        const thresholdValue = thresholdForm.get('value').value;
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

      if (thresholdType === ADAPTIVE_BASELINE) {
        // TODO: NEW TEXT NEEDED?
        return '';
      }

      const thresholdValue = thresholdForm.get('value').value;
      if (thresholdOperator === operators.NOT_EMPTY) {
        return t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.logsNotEmpty', {
          context: getHigherOrLowerOperatorContext(thresholdOperator),
          levelText: levelText,
          thresholdValue: thresholdValue
        });
      }
      return t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.logsDefault', {
        context: getHigherOrLowerOperatorDescriptionContext(
          operatorDescriptionContextValues[ruleOperator],
          thresholdOperator
        ),
        levelText: levelText,
        message: message,
        thresholdValue: thresholdValue
      });
    }
    case 'statusCode': {
      const statusCodeStart = ruleForm.get('statusCode').get('statusCodeStart').value;
      const statusCodeEnd = ruleForm.get('statusCode').get('statusCodeEnd').value;

      if (thresholdType === STATIC_THRESHOLD) {
        const thresholdValue = thresholdForm.get('value').value;
        return t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.statusCodeStaticThreshold', {
          context: getHigherOrLowerOperatorContext(thresholdOperator),
          statusCodeFullText: getStatusCodeFullText(statusCodeStart, statusCodeEnd),
          thresholdValue: thresholdValue
        });
      }

      return t('in-alerting:smartAlerts.applications.formUtils.descriptionPlaceholder.statusCodeDefault', {
        context: getHigherOrLowerOperatorContext(thresholdOperator),
        statusCodeFullText: getStatusCodeFullText(statusCodeStart, statusCodeEnd)
      });
    }
    case 'throughput': {
      if (thresholdType === ADAPTIVE_BASELINE) {
        // TODO: NEW TEXT NEEDED?
        return '';
      }

      if (thresholdType === STATIC_THRESHOLD) {
        const thresholdValue = thresholdForm.get('value').value;
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
  if (statusCodeStart === statusCodeEnd) {
    return statusCodeStart.toString();
  } else if (statusCodeStart % 100 === 0 && statusCodeEnd - statusCodeStart === 99) {
    // predefined ranges (e.g. 400 - 499): 4XX
    return `${parseInt(statusCodeStart / 100).toString()}XX`;
  } else {
    // custom ranges
    return `${statusCodeStart} - ${statusCodeEnd}`;
  }
}

function getStatusCodeFullText(statusCodeStart, statusCodeEnd) {
  if (statusCodeStart === statusCodeEnd) {
    return getStatusCodeLabel(statusCodeStart.toString());
  } else if (statusCodeStart % 100 === 0 && statusCodeEnd - statusCodeStart === 99) {
    // predefined ranges (e.g. 400 - 499): 4XX
    return getStatusCodeLabel(parseInt(statusCodeStart / 100).toString());
  } else {
    // custom ranges
    return t('in-alerting:smartAlerts.applications.formUtils.customStatusCodeFullText', {
      statusCodeStart: statusCodeStart,
      statusCodeEnd: statusCodeEnd
    });
  }
}

function getHigherOrLowerOperatorContext(operator) {
  switch (operator) {
    case '>':
      // "higher than"
      return 'higherThan';
    case '>=':
      // "higher or equal to"
      return 'higherEqual';
    case '<':
      // "lower than"
      return 'lowerThan';
    case '<=':
      // "lower or equal to"
      return 'lowerEqual';
    default:
      throw Error('Unsupported operator: ' + operator);
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

export function isEntitySelectionValid(entitySelection) {
  const hasAtLeastOneValidApplicationSelection = Object.values(entitySelection ?? {}).some(
    ({ inclusive, services }) => {
      return inclusive === true || !isEmpty(services);
    }
  );

  return entitySelection !== undefined && hasAtLeastOneValidApplicationSelection;
}
