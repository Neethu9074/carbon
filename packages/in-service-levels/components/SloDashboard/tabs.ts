/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import { serviceLevelsObjectiveSummaryFullyQualified } from 'in-service-levels/navigation/path';
import SloSummary from 'in-service-levels/components/SloDashboard/components/SloSummary';
import { Tab } from 'in-components/LocationAwareTabView/types';

const tabs: Tab<ServiceLevelObjectiveConfiguration, {}>[] = [
  {
    label: 'Summary',
    path: serviceLevelsObjectiveSummaryFullyQualified,
    component: SloSummary
  }
];

export default tabs;
