/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';

import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import BlueprintSectionTitle from 'in-alerting/smart-alerts/slo/components/BlueprintSectionTitle';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import { t } from 'in-i18n';

interface BlueprintSectionPanelProps {
  children: React.ReactNode;
}

export default function BlueprintSectionPanel({ children }: BlueprintSectionPanelProps) {
  const { form } = useSloAlertFormContext();

  const thresholdField = form.getIn(['threshold']);
  const operatorField = form.getIn(['operator']);
  const isThresholdFieldValid = isFieldValid(thresholdField);
  const isOperatorFieldValid = isFieldValid(operatorField);

  return (
    <Stack gap="xsmall">
      <BlueprintSectionTitle />
      <Typography variant="heading-200" component="p" noMargin>
        {t('in-alerting:smartAlerts.slo.advancedModeContainer.thresholdTitle')}
      </Typography>
      {children}
      {!isThresholdFieldValid &&
        thresholdField.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))}
      {!isOperatorFieldValid &&
        operatorField.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))}
    </Stack>
  );
}
