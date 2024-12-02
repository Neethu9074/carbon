/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link, Typography } from '@instana/components';
import { Policy } from '@instana/types';

import { getActionConfigurationFromPolicy, isAutomatic, isManual } from 'in-automation/utils/policy';
import useHrefToPolicyDetails from 'in-automation/navigation/hooks/useHrefToPolicyDetails';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import WithSubscript from 'in-settings/components/WithSubscript';
import { ACTION_TRANSLATIONS } from 'in-automation/constants';
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
  getContent: function Content(item) {
    const hrefToPolicyDetails = useHrefToPolicyDetails();
    return (
      <Tooltip content={item.name} align="auto" delay={500} overwriteBlock>
        <WithSubscript subscript={<Subscript policy={item} />}>
          <Link href={hrefToPolicyDetails(item.id, false)}>{item.name}</Link>
        </WithSubscript>
      </Tooltip>
    );
  },
  width: 23,
  sortable: true
};

export const actionNameColumn: ColumnDefinition<Policy> = {
  id: 'actionName',
  label: t('in-automation:actionName'),
  getContent: item => {
    const action = getActionConfigurationFromPolicy(item).action;
    return (
      <Tooltip content={action.name} align="topLeft" delay={500} overwriteBlock>
        <WithSubscript subscript={ACTION_TRANSLATIONS[action.type]}>
          <Typography noWrap variant="body-regular">
            {action.name}
          </Typography>
        </WithSubscript>
      </Tooltip>
    );
  },
  width: 23,
  sortable: true
};
