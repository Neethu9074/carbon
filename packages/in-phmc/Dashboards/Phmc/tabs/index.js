/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { phmcDashboardFullyQualified } from 'in-phmc/navigation/paths';
import PhmcSystems from 'in-phmc/Dashboards/Phmc/tabs/PhmcSystems';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-phmc:dashboards.systems'),
    path: `${phmcDashboardFullyQualified}/phmc-systems`,
    component: PhmcSystems
  }
];
