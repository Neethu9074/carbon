/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import theme from 'in-themes';
import React from 'react';

import alertEvaluationTypes, {
  PER_AP,
  PER_AP_SERVICE
} from 'in-applications/alerting/advanced/EvaluationSwitch/alertEvaluationTypes';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';
import CheckboxFancy from 'in-components/form/CheckboxFancy';

import locals from 'in-applications/alerting/advanced/EvaluationSwitch/AlertEvaluationControl.mless';

export default function AlertEvaluationControl({ form, updateForm }) {
  const evaluationType = form.get('evaluationType').value;
  return (
    <div className={locals.container}>
      <IconLabel
        type="lib_alerts_multiple_alerts"
        text="Individual Alerts"
        noBottomMargin
        color={theme.lib.colors.N600Light}
      />
      <div className={locals.options}>
        {[PER_AP, PER_AP_SERVICE].map(type => (
          <CheckboxFancy
            key={type}
            label={alertEvaluationTypes[type].selectionText}
            checked={type === evaluationType}
            onChange={() => updateForm(form.updateIn(['evaluationType'], f => f.setValue(type).setTouched(true)))}
            asRadioButton
          />
        ))}
      </div>
    </div>
  );
}
