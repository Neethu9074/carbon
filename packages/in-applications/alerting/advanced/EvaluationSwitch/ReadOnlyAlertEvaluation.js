import React from 'react';

import alertEvaluationTypes, {
  PER_AP,
  PER_AP_SERVICE
} from 'in-applications/alerting/advanced/EvaluationSwitch/alertEvaluationTypes';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import theme from 'in-themes';

import locals from 'in-applications/alerting/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation.mless';

export default function ReadOnlyAlertEvaluation({ evaluationType = PER_AP }) {
  return (
    <div className={locals.container}>
      <IconLabel
        type="lib_alerts_multiple_alerts"
        text="Individual Alerts for"
        noBottomMargin
        color={theme.lib.colors.N600Light}
      />
      <div className={locals.options}>
        {[PER_AP, PER_AP_SERVICE].map(type => {
          // if same as evaluationType
          const checked = type === evaluationType;
          const { text } = alertEvaluationTypes[type];
          if (text) {
            return <CheckboxFancy label={text} checked={checked} asRadioButton />;
          }
          return null;
        })}
      </div>
    </div>
  );
}
