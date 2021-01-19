/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import theme from 'in-themes';
import React from 'react';

import alertEvaluationTypes, { PER_AP } from 'in-applications/alerting/advanced/EvaluationSwitch/alertEvaluationTypes';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';

import locals from 'in-applications/alerting/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation.mless';

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
