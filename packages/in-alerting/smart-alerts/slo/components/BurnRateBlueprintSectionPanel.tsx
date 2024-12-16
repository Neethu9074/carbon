/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, ValidationBlock } from '@instana/components';

import BurnRateBlueprintSectionContent from 'in-alerting/smart-alerts/slo/components/BurnRateBlueprintSectionContent';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import BlueprintSectionTitle from 'in-alerting/smart-alerts/slo/components/BlueprintSectionTitle';

export default function BurnRateBlueprintSectionPanel() {
  const { form } = useSloAlertFormContext();
  const sloIdsField = form.getIn(['sloIds']);

  const shouldShowError = sloIdsField.value.length === 0;

  return (
    <Stack gap="xsmall">
      <BlueprintSectionTitle />
      {shouldShowError ? (
        sloIdsField.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))
      ) : (
        <BurnRateBlueprintSectionContent />
      )}
    </Stack>
  );
}
