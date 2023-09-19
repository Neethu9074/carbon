/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import alertEvaluationTypes, {
  PER_AP
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import IconLabel from 'in-alerting/components/IconLabel';
import { AlertEvaluationType } from 'in-types';
import { useTheme } from 'in-themes';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation.mless';

interface Props {
  evaluationType?: AlertEvaluationType;
  isGlobalSmartAlert?: boolean;
}

export default function ReadOnlyAlertEvaluation({ evaluationType = PER_AP, isGlobalSmartAlert }: Props) {
  const theme = useTheme();
  const { description, globalDescription } = alertEvaluationTypes[evaluationType];

  return (
    <div className={locals.container}>
      <IconLabel
        type="lib_alerts_multiple_alerts"
        text={isGlobalSmartAlert ? globalDescription : description}
        color={theme.ids.color.option.neutral['600']}
        noBottomMargin
      />
    </div>
  );
}
