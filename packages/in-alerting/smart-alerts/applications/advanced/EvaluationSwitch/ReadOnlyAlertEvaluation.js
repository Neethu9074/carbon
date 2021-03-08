/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import alertEvaluationTypes, {
  PER_AP
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import IconLabel from 'in-alerting/components/IconLabel';
import theme from 'in-themes';

import locals from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation.mless';

export default function ReadOnlyAlertEvaluation({ evaluationType = PER_AP }) {
  const { description } = alertEvaluationTypes[evaluationType];
  return (
    <div className={locals.container}>
      <IconLabel
        type="lib_alerts_multiple_alerts"
        text={description}
        color={theme.lib.colors.N600Light}
        noBottomMargin
      />
    </div>
  );
}
