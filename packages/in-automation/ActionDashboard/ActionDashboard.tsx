/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo } from 'react';

import ActionDashboardHeader from 'in-automation/ActionDashboard/ActionDashboardHeader';
import { actionDashboardUrlParameters } from 'in-automation/navigation/urlParameters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import tabs from 'in-automation/ActionDashboard/tabs';
import useUrlState from 'in-hooks/useUrlState';
import { getAction } from 'in-automation/api';

export default function ActionDashboard() {
  const { location } = useNavigation();
  const [{ id }] = useUrlState<{ id: string }>({
    bind: [actionDashboardUrlParameters.id]
  });

  const result = useMemo(() => getAction(id), [id]);
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.automation,
          pageRootName: pageNames.automation_action_view
        }}
      />
      <TabView props={{}} result$={result} location={location} HeaderComponent={ActionDashboardHeader} tabs={tabs} />
    </>
  );
}
