/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { policiesConfigurationFullyQualified, policiesSummaryFullyQualified } from 'in-automation/navigation/paths';
import { defaultPolicyUrlParameters } from 'in-automation/navigation/urlParameters';
import PolicyConfiguration from 'in-automation/Policies/PolicyConfiguration';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import TabView from 'in-components/LocationAwareTabView/TabView';
import PolicySummary from 'in-automation/Policies/PolicySummary';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { Nullish, Policy, Result } from 'in-types';
import useUrlState from 'in-hooks/useUrlState';
import { getPolicy } from 'in-automation/api';
import { t } from 'in-i18n';

const tabs: Tab<Policy, {}>[] = [
  {
    label: t('in-automation:policies.summary'),
    path: policiesSummaryFullyQualified,
    component: PolicySummary,
    hideTabLabelWhenAlone: true
  },
  {
    label: t('in-automation:policies.configuration'),
    path: policiesConfigurationFullyQualified,
    component: PolicyConfiguration,
    hideTabLabelWhenAlone: true
  }
];

export default function PolicyDashboard() {
  const location = useLocation();
  const [{ policyId }] = useUrlState<{ policyId: string }>({
    bind: [defaultPolicyUrlParameters.policyId]
  });

  return (
    <TabView
      location={location}
      result$={getPolicy(policyId)}
      HeaderComponent={PolicyDashboardHeader}
      tabs={tabs}
      props={{}}
    />
  );
}

function PolicyDashboardHeader({ result }: { result: Result<Policy> | Nullish }) {
  return (
    <DashboardHeader
      title={t('in-service-levels:general.serviceLevelObjective')}
      label={result?.data?.name ?? ''}
      icon="lib_automation"
      result={result}
    />
  );
}
