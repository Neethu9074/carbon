/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';
import { Policy } from '@instana/types';

import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { isAutomatic, isManual } from 'in-automation/Policies/types';
import WithSubscript from 'in-settings/components/WithSubscript';
import { getType } from 'in-automation/ActionCatalog/shared';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

function Subscript({ policy }: { policy: Policy }) {
  if (isManual(policy) && isAutomatic(policy)) {
    return <>{t('in-automation:policies.manualAutomatic')}</>;
  }
  if (isManual(policy)) {
    return <>{t('in-automation:policies.manual')}</>;
  }
  if (isAutomatic(policy)) {
    return <>{t('in-automation:policies.automatic')}</>;
  }
  return null;
}

export const nameColumn: ColumnDefinition<Policy> = {
  id: 'name',
  label: t('in-automation:name'),
  getContent: item => (
    <Tooltip content={item.name} align="auto" delay={500} overwriteBlock>
      <WithSubscript subscript={<Subscript policy={item} />}>
        <Typography noWrap variant="body-regular">
          {item.name}
        </Typography>
      </WithSubscript>
    </Tooltip>
  ),
  width: 23,
  sortable: true
};

export const actionNameColumn: ColumnDefinition<Policy> = {
  id: 'actionName',
  label: t('in-automation:policies.actionName'),
  getContent: item => (
    <Tooltip
      content={item.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action.name}
      align="topLeft"
      delay={500}
    >
      <WithSubscript subscript={getType(item.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action.type)}>
        <Typography noWrap variant="body-regular">
          {item.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action.name}
        </Typography>
      </WithSubscript>
    </Tooltip>
  ),
  width: 23,
  sortable: true
};
