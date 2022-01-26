/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { lparDashboardFullyQualified } from 'in-phmc/navigation/paths';
import Network from 'in-phmc/Dashboards/Lpar/tabs/Network';
import Storage from 'in-phmc/Dashboards/Lpar/tabs/Storage';
import Summary from 'in-phmc/Dashboards/Lpar/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-phmc:dashboards.summary'),
    path: `${lparDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-phmc:dashboards.network'),
    path: `${lparDashboardFullyQualified}/network`,
    component: Network
  },
  {
    label: t('in-phmc:dashboards.storage'),
    path: `${lparDashboardFullyQualified}/storage`,
    component: Storage
  }
];
