/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  extractAlertConfigWithFormModel,
  getErrorMessage
} from 'in-alerting/smart-alerts/eum/utils/thresholdChartUtil';
import { RuleWithThreshold, MobileAppAlertRuleUnion, WebsiteAlertRuleUnion } from 'in-types';
import { t } from 'in-i18n';

describe('extractAlertConfigWithFormModel', () => {
  it('should return the correct alert config', () => {
    const ruleWithThreshold = {
      thresholdOperator: '>=',
      rule: {
        alertType: 'specificJsError',
        metricName: 'errors',
        operator: 'EQUALS',
        value: 'undefined has no properties',
        aggregation: 'SUM'
      },
      thresholds: {
        WARNING: {
          type: 'staticThreshold',
          value: 11
        }
      }
    } as RuleWithThreshold<MobileAppAlertRuleUnion | WebsiteAlertRuleUnion>;
    const expectedAlertConfig = {
      alertType: 'specificJsError',
      definedThresholdType: 'staticThreshold',
      metricName: 'errors'
    };
    expect(extractAlertConfigWithFormModel(ruleWithThreshold)).toEqual(expectedAlertConfig);
  });

  it('should return the correct alert config when CRITICAL_SEVERITY threshold is defined', () => {
    const ruleWithThreshold = {
      thresholdOperator: '>=',
      rule: {
        alertType: 'specificJsError',
        metricName: 'errors',
        operator: 'EQUALS',
        value: 'undefined has no properties',
        aggregation: 'SUM'
      },
      thresholds: {
        CRITICAL: {
          type: 'staticThreshold',
          value: 90
        }
      }
    } as RuleWithThreshold<MobileAppAlertRuleUnion | WebsiteAlertRuleUnion>;
    const expectedAlertConfig = {
      alertType: 'specificJsError',
      definedThresholdType: 'staticThreshold',
      metricName: 'errors'
    };
    expect(extractAlertConfigWithFormModel(ruleWithThreshold)).toEqual(expectedAlertConfig);
  });
});

describe('getErrorMessage', () => {
  it('should return error message if queryError is true', () => {
    const errorMessage = getErrorMessage(true);
    expect(errorMessage).toBe(t('in-alerting:components.chart.alertingChartMessageInvalidFilterQuery'));
  });

  it('should return undefined if queryError is false', () => {
    const errorMessage = getErrorMessage(false);
    expect(errorMessage).toBeUndefined();
  });
});
