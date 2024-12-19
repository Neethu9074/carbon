/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import { subtraceConfigurationFullyQualified, subtraceDashboard } from 'in-applications/navigation/paths';
import { SubtraceConfiguration } from 'in-applications/Dashboards/subtrace/tabs/SubtraceConfiguration';
import { Summary } from 'in-applications/Dashboards/subtrace/tabs/Summary';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import { Result } from 'in-types';

export interface SubtraceTabData {
  id: string;
}

const subtraceTabs: Tab<SubtraceTabData, Result<Subtrace | undefined>>[] = [
  {
    label: t('in-applications:labelSummary'),
    path: `${subtraceDashboard}/summary`,
    component: wrapWithMessage(Summary)
  },
  {
    label: t('in-applications:labelSmartAlerts'),
    path: '${subtraceDashboard}/smartAlerts',
    component: Summary
  },
  {
    label: t('in-applications:labelConfiguration'),
    path: subtraceConfigurationFullyQualified,
    component: SubtraceConfiguration
  }
];

export default subtraceTabs;

function wrapWithMessage(Component: any): any {
  return (props: any) => {
    return <Component {...props} />;
  };
}
