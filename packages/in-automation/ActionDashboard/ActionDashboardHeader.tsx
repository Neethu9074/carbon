/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonTag } from '@instana/components';

import { ACTION_TRANSLATIONS } from 'in-automation/constants';
import DashboardHeader from 'in-components/DashboardHeader';
import { Nullish, Action, Result } from 'in-types';
import { t } from 'in-i18n';

interface ActionDashboardHeaderProps {
  result: Result<Action> | Nullish;
}

export default function ActionDashboardHeader({ result }: ActionDashboardHeaderProps) {
  const { data: action } = result ?? {};
  const { name = '', type } = action ?? {};

  const label = (
    <>
      {name}{' '}
      <CarbonTag type="blue" size="md">
        {type ? ACTION_TRANSLATIONS[type] : ''}
      </CarbonTag>{' '}
    </>
  );

  return (
    <DashboardHeader title={t('in-automation:automationAction')} label={label} icon="lib_automation" result={result} />
  );
}
