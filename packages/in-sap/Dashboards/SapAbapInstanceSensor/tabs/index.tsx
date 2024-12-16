/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error Module needs to be translated to TS
import { sapAbapInstanceSensorDashboardFullyQualified } from 'in-sap/navigation/paths';
import SecurityEssentials from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/SecurityEssentials';
import RelatedResources from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RelatedResources';
import UserInformation from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserInformation';
import Diagnostics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Diagnostics';
import Workload from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Workload';
import Networks from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Networks';
import Summary from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Summary';
import Memory from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Memory';
import Fiori from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Fiori';
import Idoc from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Idoc';
import RFC from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RFC';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.workload'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/workload`,
    component: Workload
  },
  {
    label: t('in-sap:dashboards.memory'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/memory`,
    component: Memory
  },
  {
    label: t('in-sap:dashboards.userInformation'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/userInformation`,
    component: UserInformation
  },
  {
    label: t('in-sap:dashboards.sapSecurityInsights'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/sapSecurityInsights`,
    component: SecurityEssentials
  },
  {
    label: t('in-sap:dashboards.rfc'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/rfc`,
    component: RFC
  },
  {
    label: t('in-sap:dashboards.sapNetworks'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/sapNetworks`,
    component: Networks
  },
  {
    label: t('in-sap:dashboards.sapFiori'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/sapFiori`,
    component: Fiori
  },
  {
    label: t('in-sap:dashboards.sapIdoc'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/sapIdoc`,
    component: Idoc
  },
  {
    label: t('in-sap:dashboards.diagnostics'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/diagnostics`,
    component: Diagnostics
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${sapAbapInstanceSensorDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
