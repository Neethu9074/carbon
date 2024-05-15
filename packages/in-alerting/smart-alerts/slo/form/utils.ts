/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from '@instana/i18n-react';

import { SloAlertForm } from 'in-alerting/smart-alerts/slo/form/alertFormDefinition';
import { ServiceLevelsAlertConfig, ServiceLevelsAlertRuleUnion } from 'in-types';
import { percentage } from 'in-services/formatters/number';

export function formToSloAlertConfiguration(form: SloAlertForm): ServiceLevelsAlertConfig {
  const alertChannelIds = form.getIn(['alertChannelIds']).value;
  const customPayloadFields = form.getIn(['customPayloadFields']).toJS();
  const description = form.getIn(['description']).value;
  const name = form.getIn(['name']).value;
  const rule = form.getIn(['rule']).toJS() as ServiceLevelsAlertRuleUnion;
  const severity = form.getIn(['severity']).value;
  const sloIds = form.getIn(['sloIds']).value;
  const threshold = form.getIn(['threshold']).value ?? 0;
  const timeThreshold = form.getIn(['timeThreshold']).toJS();
  const triggering = form.getIn(['triggering']).value;
  const operator = form.getIn(['operator']).value;
  return {
    alertChannelIds,
    customPayloadFields,
    description,
    name,
    rule,
    severity,
    sloIds,
    threshold: {
      type: 'staticThreshold',
      value: threshold,
      operator,
      lastUpdated: Date.now()
    },
    timeThreshold,
    triggering
  };
}

export function updateSloAlertNameAndDescription(form: SloAlertForm): SloAlertForm {
  const alertType = form.getIn(['rule', 'alertType']).value;
  const threshold = percentage.detailed(form.getIn(['threshold']).value ?? 0);

  let updatedForm = form;

  if (!form.get('name').touched) {
    const titlePlaceholder = t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesTitlePlaceholder', {
      context: alertType,
      percentage: threshold
    });
    updatedForm = updatedForm.updateIn(['name'], nameField => nameField.setValue(titlePlaceholder));
  }

  if (!form.get('description').touched) {
    const descriptionPlaceholder = t(
      'in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesDescriptionPlaceholder',
      {
        context: alertType,
        percentage: threshold
      }
    );
    updatedForm = updatedForm.updateIn(['description'], descriptionField =>
      descriptionField.setValue(descriptionPlaceholder)
    );
  }

  return updatedForm;
}
