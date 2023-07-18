/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { t } from '@instana/i18n-react';

import {
  serviceLevelsObjectiveSummaryFullyQualified,
  serviceLevelsObjectiveConfigurationFullyQualified
} from 'in-service-levels/navigation/path';
import SloConfigurationDetails from 'in-service-levels/components/SloDashboard/components/SloConfigurationDetails';
import SloSummary from 'in-service-levels/components/SloDashboard/components/SloSummary';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { LabeledEntity } from 'in-service-levels/types';

export interface SloTabData {
  configuration: ServiceLevelObjectiveConfiguration;
  entity: LabeledEntity;
}

export interface ApplicationSloTabData extends SloTabData {
  service?: LabeledEntity;
  endpoint?: LabeledEntity;
}

export function isApplicationSloTabData(data: SloTabData): data is ApplicationSloTabData {
  const { service, endpoint } = data as ApplicationSloTabData;
  return Boolean(service || endpoint);
}

const tabs: Tab<SloTabData, {}>[] = [
  {
    label: t('in-service-levels:sloDashboard.tabs.summaryLabel'),
    path: serviceLevelsObjectiveSummaryFullyQualified,
    component: SloSummary,
    hideTabLabelWhenAlone: true
  },
  {
    label: t('in-service-levels:sloDashboard.tabs.configurationLabel'),
    path: serviceLevelsObjectiveConfigurationFullyQualified,
    component: SloConfigurationDetails,
    hideTabLabelWhenAlone: true
  }
];

export default tabs;
