/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zhmcDashboardFullyQualified } from 'in-zhmc/navigation/paths';
import ZhmcSystems from 'in-zhmc/Dashboards/Zhmc/tabs/ZhmcSystems';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-zhmc:dashboards.systems'),
    path: `${zhmcDashboardFullyQualified}/zhmc-systems`,
    component: ZhmcSystems
  }
];
