/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import alertEvaluationTypes, {
  PER_AP,
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { applicationSmartAlertsPerEndpointsEnabled } from 'in-services/featureFlags';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import IconLabel from 'in-alerting/components/IconLabel';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/AlertEvaluationControl.mless';

export default function AlertEvaluationControl({ form, updateForm, isGlobalSmartAlert }) {
  const evaluationType = form.get('evaluationType').value;
  const alertType = form.get('rule').get('alertType').value;
  return (
    <div className={locals.container}>
      <IconLabel
        type="lib_alerts_multiple_alerts"
        text={t('in-alerting:smartAlerts.applications.advanced.evaluationSwitch.individual')}
        noBottomMargin
        color={theme.lib.colors.N600Light}
      />
      <div className={locals.options}>
        {(applicationSmartAlertsPerEndpointsEnabled
          ? [PER_AP, PER_AP_SERVICE, PER_AP_ENDPOINT]
          : [PER_AP, PER_AP_SERVICE]
        ).map(type => (
          <CheckboxFancy
            key={type}
            label={
              isGlobalSmartAlert
                ? alertEvaluationTypes[type].globalSelectionText
                : alertEvaluationTypes[type].selectionText
            }
            checked={type === evaluationType}
            onChange={() =>
              updateForm(
                form
                  .updateIn(['evaluationType'], f => f.setValue(type).setTouched(true))
                  // As of now, we only support static-threshold when Per-Entity grouping is used.
                  .put(
                    'threshold',
                    createThresholdForm(
                      {
                        type: 'staticThreshold'
                      },
                      alertType
                    )
                  )
              )
            }
            asRadioButton
          />
        ))}
      </div>
    </div>
  );
}
