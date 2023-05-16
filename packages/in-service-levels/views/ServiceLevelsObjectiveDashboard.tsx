/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import SloDashboardHeader from 'in-service-levels/components/SloDashboard/components/SloDashboardHeader';
import { defaultServiceLevelObjectiveUrlParameters } from 'in-service-levels/navigation/urlParameters';
import { getSloConfiguration } from 'in-service-levels/api/configuration';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import tabs from 'in-service-levels/components/SloDashboard/tabs';
import TabView from 'in-components/LocationAwareTabView/TabView';
import useUrlState from 'in-hooks/useUrlState';

export default function ServiceLevelsObjectiveDashboard() {
  const location = useLocation();
  const [{ sloId }] = useUrlState<{ sloId: string }>({
    bind: [defaultServiceLevelObjectiveUrlParameters.sloId]
  });

  return (
    <TabView
      location={location}
      result$={getSloConfiguration(sloId)}
      HeaderComponent={SloDashboardHeader}
      tabs={tabs}
      props={{}}
    />
  );
}
