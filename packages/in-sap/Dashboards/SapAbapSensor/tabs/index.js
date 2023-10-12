/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import SecurityEssentials from 'in-sap/Dashboards/SapAbapSensor/tabs/SecurityEssentials';
import { sapAbapSensorDashboardFullyQualified } from 'in-sap/navigation/paths';
import Detailed from 'in-sap/Dashboards/SapAbapSensor/tabs/Detailed';
import Networks from 'in-sap/Dashboards/SapAbapSensor/tabs/Networks';
import Summary from 'in-sap/Dashboards/SapAbapSensor/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapAbapSensorDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.systemOverview'),
    path: `${sapAbapSensorDashboardFullyQualified}/systemOverview`,
    component: Detailed
  },
  {
    label: t('in-sap:dashboards.sapSecurityInsights'),
    path: `${sapAbapSensorDashboardFullyQualified}/sapSecurityInsights`,
    component: SecurityEssentials
  },
  {
    label: t('in-sap:dashboards.sapNetworks'),
    path: `${sapAbapSensorDashboardFullyQualified}/sapNetworks`,
    component: Networks
  }
].filter(Boolean);
