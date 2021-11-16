/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { viosDashboardFullyQualified } from 'in-phmc/navigation/paths';
import Storage from 'in-phmc/Dashboards/Vios/tabs/Storage';
import Summary from 'in-phmc/Dashboards/Vios/tabs/Summary';
import Network from 'in-phmc/Dashboards/Vios/tabs/Network';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-phmc:dashboards.summary'),
    path: `${viosDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-phmc:dashboards.network'),
    path: `${viosDashboardFullyQualified}/network`,
    component: Network
  },
  {
    label: t('in-phmc:dashboards.storage'),
    path: `${viosDashboardFullyQualified}/storage`,
    component: Storage
  }
];
