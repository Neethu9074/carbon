/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error Module needs to be translated to TS
import NetworkPorts from 'in-zhmc/Dashboards/Systems/tabs/NetworkPorts';
// @ts-expect-error Module needs to be translated to TS
import Partitions from 'in-zhmc/Dashboards/Systems/tabs/Partitions';
// @ts-expect-error Module needs to be translated to TS
import Summary from 'in-zhmc/Dashboards/Systems/tabs/Summary';
import Environmental from 'in-zhmc/Dashboards/Systems/tabs/Environmental';
import { cpcDashboardFullyQualified } from 'in-zhmc/navigation/paths';
import Channel from 'in-zhmc/Dashboards/Systems/tabs/Channel';
import Adapter from 'in-zhmc/Dashboards/Systems/tabs/Adapter';
import { t } from 'in-i18n';

interface Tab {
  label: string;
  path: string;
  component: React.ComponentType<any>;
}

const tabs: Tab[] = [
  {
    label: t('in-zhmc:dashboards.summary'),
    path: `${cpcDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-zhmc:dashboards.environmentalAndPower'),
    path: `${cpcDashboardFullyQualified}/environmentalAndPower`,
    component: Environmental
  },
  {
    label: t('in-zhmc:dashboards.partition'),
    path: `${cpcDashboardFullyQualified}/partition`,
    component: Partitions
  },
  {
    label: t('in-zhmc:dashboards.channel'),
    path: `${cpcDashboardFullyQualified}/channel`,
    component: Channel
  },
  {
    label: t('in-zhmc:dashboards.adapter'),
    path: `${cpcDashboardFullyQualified}/adapter`,
    component: Adapter
  },
  {
    label: t('in-zhmc:dashboards.networkPort'),
    path: `${cpcDashboardFullyQualified}/networkPort`,
    component: NetworkPorts
  }
];

export default tabs;
