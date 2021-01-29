/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getLogLevelRuleOperatorLabel, getStatusCodeLabel } from 'in-applications/alerting/form/ruleFormData';
import { getValueRoundedToDecimals } from 'in-new-components/Alerting/utils/formatUtils';
import { getAggregationText } from 'in-new-components/Alerting/utils/formUtils';
import { isGreaterOperator } from 'in-new-components/Alerting/utils/alertUtils';
import { operators } from 'in-analyze/applicationFilter';
import { t } from 'in-i18n';

const operatorDescriptionValues = {
  [operators.EQUALS]: t('in-applications:formUtils.operators.equals'),
  [operators.CONTAINS]: t('in-applications:formUtils.operators.contains'),
  [operators.STARTS_WITH]: t('in-applications:formUtils.operators.startsWith'),
  [operators.ENDS_WITH]: t('in-applications:formUtils.operators.endsWith')
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
      return t('in-applications:formUtils.titlePlaceholder.errorRate');
    case 'slowness':
      return t('in-applications:formUtils.titlePlaceholder.slowness');
    case 'logs': {
      const message = ruleForm.get('message').value;
      const ruleOperator = ruleForm.get('operator').value;
      const level = ruleForm.get('level').value;

      if (ruleOperator === operators.NOT_EMPTY) {
        if (level === 'ANY') {
          return t('in-applications:formUtils.titlePlaceholder.logs.notEmptyWithANY');
        }
        return t('in-applications:formUtils.titlePlaceholder.logs.notEmptyWithoutANY', {
          operatorLabel: getLogLevelRuleOperatorLabel(level)
        });
      }

      if (level === 'ANY') {
        return t('in-applications:formUtils.titlePlaceholder.logs.withANY', {
          message: message
        });
      }
      return t('in-applications:formUtils.titlePlaceholder.logs.default', {
        operatorLabel: getLogLevelRuleOperatorLabel(level),
        message: message
      });
    }
    case 'statusCode': {
      const statusCodeStart = ruleForm.get('statusCodeStart').value;
      const statusCodeEnd = ruleForm.get('statusCodeEnd').value;
      return t('in-applications:formUtils.titlePlaceholder.statusCode', {
        statusCodeShortText: getStatusCodeShortText(statusCodeStart, statusCodeEnd)
      });
    }
    case 'throughput': {
      const thresholdOperator = form.get('threshold').get('operator').value;
      const isGreaterOp = isGreaterOperator(thresholdOperator);
      const greaterOpText = isGreaterOp
        ? t('in-applications:formUtils.titlePlaceholder.high')
        : t('in-applications:formUtils.titlePlaceholder.low');
      return t('in-applications:formUtils.titlePlaceholder.throughput', {
        greaterOpText: greaterOpText
      });
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

  switch (alertType) {
    case 'errorRate': {
      const thresholdValue = thresholdForm.get('value').value;
      return t('in-applications:formUtils.descriptionPlaceholder.errorRate', {
        higherOrLowerOperatorText: getHigherOrLowerOperatorText(thresholdOperator),
        valueRoundedToDecimals: getValueRoundedToDecimals(thresholdValue, true)
      });
    }
    case 'slowness': {
      const aggregation = ruleForm.get('aggregation').value;
      const thresholdType = thresholdForm.get('type').value;
      if (thresholdType === 'staticThreshold') {
        const thresholdValue = thresholdForm.get('value').value;
        return t('in-applications:formUtils.descriptionPlaceholder.slownessStaticThreshold', {
          slowerOrBelowOperatorText: getSlowerOrBelowOperatorText(thresholdOperator),
          thresholdValue: thresholdValue,
          aggregationText: getAggregationText(aggregation)
        });
      }
      return t('in-applications:formUtils.descriptionPlaceholder.slownessDefault', {
        slowerOrBelowOperatorText: getSlowerOrBelowOperatorText(thresholdOperator),
        aggregationText: getAggregationText(aggregation)
      });
    }
    case 'logs': {
      const message = ruleForm.get('message').value;
      const ruleOperator = ruleForm.get('operator').value;
      const level = ruleForm.get('level').value;
      const levelText = getLogLevelRuleOperatorLabel(level);
      const thresholdValue = thresholdForm.get('value').value;

      if (thresholdOperator === operators.NOT_EMPTY) {
        return t('in-applications:formUtils.descriptionPlaceholder.logsNotEmpty', {
          levelText: levelText,
          higherOrLowerOperatorText: getHigherOrLowerOperatorText(thresholdOperator),
          thresholdValue: thresholdValue
        });
      }
      return t('in-applications:formUtils.descriptionPlaceholder.logsDefault', {
        levelText: levelText,
        operatorValue: operatorDescriptionValues[ruleOperator],
        message: message,
        higherOrLowerOperatorText: getHigherOrLowerOperatorText(thresholdOperator),
        thresholdValue: thresholdValue
      });
    }
    case 'statusCode': {
      const statusCodeStart = ruleForm.get('statusCodeStart').value;
      const statusCodeEnd = ruleForm.get('statusCodeEnd').value;
      const thresholdForm = form.get('threshold');
      const thresholdValue = thresholdForm.get('value').value;
      return t('in-applications:formUtils.descriptionPlaceholder.statusCode', {
        statusCodeFullText: getStatusCodeFullText(statusCodeStart, statusCodeEnd),
        higherOrLowerOperatorText: getHigherOrLowerOperatorText(thresholdOperator),
        thresholdValue: thresholdValue
      });
    }
    case 'throughput': {
      const thresholdType = thresholdForm.get('type').value;
      if (thresholdType === 'staticThreshold') {
        const thresholdValue = thresholdForm.get('value').value;
        return t('in-applications:formUtils.descriptionPlaceholder.throughputStaticThreshold', {
          higherOrLowerOperatorText: getHigherOrLowerOperatorText(thresholdOperator),
          thresholdValue: thresholdValue
        });
      }
      return t('in-applications:formUtils.descriptionPlaceholder.throughputDefault', {
        higherOrLowerOperatorText: getHigherOrLowerOperatorText(thresholdOperator)
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
    return t('in-applications:formUtils.customStatusCodeFullText', {
      statusCodeStart: statusCodeStart,
      statusCodeEnd: statusCodeEnd
    });
  }
}

function getHigherOrLowerOperatorText(operator) {
  switch (operator) {
    case '>':
      return t('in-applications:formUtils.higherOrLowerText.higherThan');
    case '>=':
      return t('in-applications:formUtils.higherOrLowerText.higherEqual');
    case '<':
      return t('in-applications:formUtils.higherOrLowerText.lowerThan');
    case '<=':
      return t('in-applications:formUtils.higherOrLowerText.lowerEqual');
    default:
      throw Error('Unsupported operator: ' + operator);
  }
}

function getSlowerOrBelowOperatorText(operator) {
  switch (operator) {
    case '>':
      return t('in-applications:formUtils.slowerOrBelowText.slowerThan');
    case '>=':
      return t('in-applications:formUtils.slowerOrBelowText.slowerEqual');
    case '<':
      return t('in-applications:formUtils.slowerOrBelowText.below');
    case '<=':
      return t('in-applications:formUtils.slowerOrBelowText.belowEqual');
    default:
      throw Error('Unsupported operator: ' + operator);
  }
}
