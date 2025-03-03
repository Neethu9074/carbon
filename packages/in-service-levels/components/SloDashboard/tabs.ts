/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import {
  serviceLevelsObjectiveSummaryFullyQualified,
  serviceLevelsObjectiveConfigurationFullyQualified,
  serviceLevelsObjectiveAlertsFullyQualified
} from 'in-service-levels/navigation/path';
import SloConfigurationDetails from 'in-service-levels/components/SloDashboard/components/SloConfigurationDetails';
import SloSmartAlerts from 'in-service-levels/components/SloDashboard/components/SloSmartAlerts';
import SloSummary from 'in-service-levels/components/SloDashboard/components/SloSummary';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { LabeledEntity } from 'in-service-levels/types';
import { t } from 'in-i18n';

export interface SloTabData {
  configuration: ServiceLevelObjectiveConfiguration;
  entities: LabeledEntity[];
}

export interface WebsiteSloTabData extends SloTabData {
  entities: [LabeledEntity];
}

export interface ApplicationSloTabData extends SloTabData {
  entities: [LabeledEntity];
  service?: LabeledEntity;
  endpoint?: LabeledEntity;
}

export function isApplicationSloTabData(data: SloTabData): data is ApplicationSloTabData {
  const { service, endpoint } = data as ApplicationSloTabData;
  return Boolean(service || endpoint);
}

const dashboardTabs: Tab<SloTabData, {}>[] = [
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
  },
  {
    label: t('in-service-levels:sloDashboard.tabs.smartAlertsLabel'),
    path: serviceLevelsObjectiveAlertsFullyQualified,
    component: SloSmartAlerts,
    hideTabLabelWhenAlone: true
  }
];

export default dashboardTabs;
