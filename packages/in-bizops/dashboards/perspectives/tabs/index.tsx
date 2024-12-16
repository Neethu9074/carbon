/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PerspectiveConfiguration from 'in-bizops/dashboards/perspectives/tabs/perspectiveConfiguration/PerspectiveConfiguration';
import { businessPerspectiveConfigPath, businessPerspectiveSummaryPath } from 'in-bizops/navigation/paths';
import Processes from 'in-bizops/dashboards/perspectives/tabs/processes/Processes';
import { t } from 'in-i18n';

export const tabs = [
  {
    id: 'processes',
    label: t('in-bizops:dashboards.perspectives.processes.tabLabel'),
    path: `${businessPerspectiveSummaryPath}`,
    component: Processes
  },
  {
    id: 'config',
    label: t('in-bizops:dashboards.perspectives.configuration.tabLabel'),
    path: `${businessPerspectiveConfigPath}`,
    component: PerspectiveConfiguration
  }
];
