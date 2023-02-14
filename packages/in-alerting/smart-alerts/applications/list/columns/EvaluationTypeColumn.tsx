/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { ApplicationAlertConfig } from '@instana/types';

import alertEvaluationTypes, {
  PER_AP
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import { t } from 'in-i18n';

export default function EvaluationTypeColumn({
  config,
  isGlobalSmartAlertConfig
}: {
  config: ApplicationAlertConfig;
  isGlobalSmartAlertConfig: boolean;
}) {
  const { evaluationType = PER_AP } = config;
  const evaluationInfo = alertEvaluationTypes[evaluationType];
  return (
    <DefaultCell
      title={
        isGlobalSmartAlertConfig
          ? t('in-alerting:smartAlerts.globalApplicationSmartAlert')
          : t('in-alerting:smartAlerts.applicationSmartAlert')
      }
      subtitle={evaluationInfo.columnText}
    />
  );
}
