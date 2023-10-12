/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import ButtonGroup from 'in-components/ButtonGroup/ButtonGroup';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ActionsButtonGroup.mless';

export interface ActionsButtonGroupProps {
  selectedType: string;
  setSelectedType: (str: string) => void;
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
      <div className={locals.actionsButtonGroup}>
        <ButtonGroup buttonPropsList={buttonProps} activeKey={selectedType} segmented />
        <BetaBadge />
      </div>
    </Stack>
  );
}
