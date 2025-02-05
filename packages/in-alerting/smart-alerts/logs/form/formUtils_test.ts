/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ThresholdOperator, VersionedConfig } from '@instana/types';

import alertFormDefinition, { AlertConfigHiddenFields } from 'in-alerting/smart-alerts/logs/form/alertFormDefinition';
import { getTitlePlaceholder, getDescriptionPlaceholder } from 'in-alerting/smart-alerts/logs/form/formUtils';
import { getHigherOrLowerOperatorContext } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { LogSmartAlertConfig } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import data from 'in-alerting/smart-alerts/logs/data/alertConfigData.json';
import { t } from 'in-i18n';

const form = alertFormDefinition(
  data.alertConfig as LogSmartAlertConfig & VersionedConfig & AlertConfigHiddenFields,
  false
);

describe('in-alerting/smart-alerts/logs/form/formUtils', () => {
  describe('getTitlePlaceholder', () => {
    it('returns the correct placeholder text', () => {
      const placeholderText = getTitlePlaceholder();
      expect(placeholderText).toBe(
        t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.alertPropertiesTitlePlaceholder')
      );
    });
  });

  describe('getDescriptionPlaceholder', () => {
    it('returns the correct placeholder text when the threshold operator is "higher than"', () => {
      const result = getDescription('>=');
      const placeholderText = getDescriptionPlaceholder(form);
      expect(placeholderText).toBe(result);
    });

    it('returns the correct placeholder text when the threshold operator is "lower than"', () => {
      const updatedForm = {
        ...data.alertConfig,
        threshold: {
          type: 'staticThreshold',
          operator: '<=',
          value: 20,
          lastUpdated: 0
        }
      };

      const form = alertFormDefinition(
        updatedForm as LogSmartAlertConfig & VersionedConfig & AlertConfigHiddenFields,
        false
      );
      const result = getDescription('<=');
      const placeholderText = getDescriptionPlaceholder(form);
      expect(placeholderText).toBe(result);
    });
  });
});

function getDescription(operator: ThresholdOperator) {
  return t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.descriptionPlaceholder.logsCount', {
    context: getHigherOrLowerOperatorContext(operator),
    value: 20
  });
}
