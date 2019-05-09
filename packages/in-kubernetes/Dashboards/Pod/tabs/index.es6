import React from 'react';

import ConditionsTabHeader from 'in-kubernetes/Dashboards/commonComponents/commonTabs/ConditionsTabHeader';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import Events from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import Infrastructure from 'in-kubernetes/Dashboards/Pod/tabs/Infrastructure';
import { podDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import getKubernetesPod from 'in-subscription/kubernetes/getKubernetesPod';
import Summary from 'in-kubernetes/Dashboards/Pod/tabs/Summary/Summary';
import Details from 'in-kubernetes/Dashboards/Pod/tabs/Details/Details';

export default [
  {
    label: 'Summary',
    path: `${podDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${podDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Conditions',
    path: `${podDashboardFullyQualified}/conditions`,
    component: Conditions,
    header: ConditionsHeader
  },
  {
    label: 'Events',
    path: `${podDashboardFullyQualified}/events`,
    component: Events
  },
  {
    label: 'Containers',
    path: `${podDashboardFullyQualified}/containers`,
    component: Infrastructure
  }
].filter(Boolean);

function ConditionsHeader({ podId, timeConfig }) {
  return (
    <ConditionsTabHeader
      getCounter={() =>
        getKubernetesPod({
          id: podId,
          timeConfig
        }).map(result => (result.data ? { data: result.data.conditions } : null))
      }
    />
  );
}
