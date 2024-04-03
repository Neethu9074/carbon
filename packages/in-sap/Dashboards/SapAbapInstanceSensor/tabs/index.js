/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import SecurityEssentials from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/SecurityEssentials';
import RelatedResources from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RelatedResources';
import { sapAbapInstanceSensorDashboardFullyQualified } from 'in-sap/navigation/paths';
import Detailed from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Detailed';
import Networks from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Networks';
import Summary from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Summary';
import Fiori from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Fiori';
import Idoc from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Idoc';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/summary`,
    icon: 'lib_sap_abapSummary',
    component: Summary
  },
  {
    label: t('in-sap:dashboards.systemOverview'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/systemOverview`,
    icon: 'lib_sap_abapSystemOverview',
    component: Detailed
  },
  {
    label: t('in-sap:dashboards.sapSecurityInsights'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/sapSecurityInsights`,
    icon: 'lib_sap_abapTransaction',
    component: SecurityEssentials
  },
  {
    label: t('in-sap:dashboards.sapNetworks'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/sapNetworks`,
    icon: 'lib_sap_abapNetworks',
    component: Networks
  },
  {
    label: t('in-sap:dashboards.sapFiori'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/sapFiori`,
    icon: 'lib_sap_abapFiori',
    component: Fiori
  },
  {
    label: t('in-sap:dashboards.sapIdoc'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/sapIdoc`,
    icon: 'lib_sap_abapIdoc',
    component: Idoc
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/relatedResources`,
    icon: 'lib_sap_abapRelatedResource',
    component: RelatedResources
  }
].filter(Boolean);
