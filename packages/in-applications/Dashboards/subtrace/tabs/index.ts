/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from '@instana/i18n-react';

import { SubtraceConfiguration } from 'in-applications/Dashboards/subtrace/tabs/SubtraceConfiguration';
import { subtraceConfigurationFullyQualified } from 'in-applications/navigation/paths';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import { Result } from 'in-types';

export interface SubtraceTabData {
  id: string;
}

const subtraceTabs: Tab<SubtraceTabData, Result<Subtrace | undefined>>[] = [
  {
    label: t('in-applications:labelConfiguration'),
    path: subtraceConfigurationFullyQualified,
    component: SubtraceConfiguration
  }
];

export default subtraceTabs;
