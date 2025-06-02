/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonTag } from '@instana/components';

import { POLICY_TYPE_TRANSLATIONS } from 'in-automation/constants';
import DashboardHeader from 'in-components/DashboardHeader';
import { Nullish, Policy, Result } from 'in-types';
import { t } from 'in-i18n';

interface PolicyDashboardHeaderProps {
  result: Result<Policy> | Nullish;
}

export default function PolicyDashboardHeader({ result }: PolicyDashboardHeaderProps) {
  const { data: action } = result ?? {};
  const { name = '', typeConfigurations } = action ?? {};
  const label = (
    <>
      {name}
      {typeConfigurations?.map(type => (
        <CarbonTag key={type.name} type="blue" size="md">
          {POLICY_TYPE_TRANSLATIONS[type.name]}
        </CarbonTag>
      ))}
    </>
  );

  return (
    <DashboardHeader title={t('in-automation:automationAction')} label={label} icon="lib_automation" result={result} />
  );
}
