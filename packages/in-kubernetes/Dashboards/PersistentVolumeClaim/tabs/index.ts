/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { persistentVolumeClaimDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Summary from 'in-kubernetes/Dashboards/PersistentVolumeClaim/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/PersistentVolumeClaim/tabs/Details';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${persistentVolumeClaimDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-kubernetes:dashboards.details'),
    path: `${persistentVolumeClaimDashboardFullyQualified}/details`,
    component: Details
  }
].filter(Boolean);
