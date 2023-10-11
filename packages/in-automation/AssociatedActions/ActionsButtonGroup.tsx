/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import ButtonGroup from 'in-components/ButtonGroup/ButtonGroup';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export interface ActionsButtonGroupProps {
  selectedType: string;
  setSelectedType: (v: string) => void;
}

export default function ActionsButtonGroup({ selectedType, setSelectedType }: ActionsButtonGroupProps) {
  const buttonProps = [
    {
      text: t('in-automation:associatedActions'),
      key: 'associatedActions',
      onClick: () => setSelectedType('associatedActions')
    },
    {
      text: t('in-automation:recommendedActions'),
      key: 'recommendedActions',
      onClick: () => setSelectedType('recommendedActions')
    }
  ];

  if (role?.canViewAutomationActionInstances) {
    buttonProps.push({
      text: t('in-automation:actionHistory.actionHistory'),
      key: 'actionHistory',
      onClick: () => setSelectedType('actionHistory')
    });
  }

  return (
    <Stack gap="xxsmall">
      <ButtonGroup buttonPropsList={buttonProps} activeKey={selectedType} segmented />
    </Stack>
  );
}
