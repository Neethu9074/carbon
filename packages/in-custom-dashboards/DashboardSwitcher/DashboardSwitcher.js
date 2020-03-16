import { withProps, compose } from 'recompose';
import React from 'react';

import DashboardSwitcherPresenter from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcherPresenter';
import { viewPathFullyQualified, dashboardIdUrlParameter } from 'in-custom-dashboards/navigation/url';
import NewDashboardDialog from 'in-custom-dashboards/NewDashboardDialog/NewDashboardDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getCustomDashboards } from 'in-custom-dashboards/api';
import { navigationParameters$ } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

const systemOverviewTitle = 'System Overview';
const loadingTitle = 'Loading…';

export default compose(
  connectTo({
    result: getCustomDashboards(),
    navigationParameters: navigationParameters$
  }),
  withProps(({ result, navigationParameters, titleOverwrite }) => ({
    activeDashboardTitle: determineActiveDashboard(result, navigationParameters, titleOverwrite),
    isLoadingMore: result.progress.loading,
    customDashboards: result && result.data,
    onCreateNewDashboard
  }))
)(DashboardSwitcherPresenter);

function determineActiveDashboard(result, navigationParameters, titleOverwrite) {
  if (titleOverwrite) {
    return titleOverwrite;
  } else if (navigationParameters.pathname !== viewPathFullyQualified) {
    return systemOverviewTitle;
  } else if (!result.data) {
    return loadingTitle;
  }

  const customDashboardId = getMatrixParameter(
    navigationParameters,
    dashboardIdUrlParameter.path,
    dashboardIdUrlParameter.name
  );
  if (!customDashboardId) {
    return loadingTitle;
  }

  for (let i = 0; i < result.data.length; i++) {
    const customDashboard = result.data[i];
    if (customDashboard.id === customDashboardId) {
      return customDashboard.title;
    }
  }

  return loadingTitle;
}

function onCreateNewDashboard() {
  addActiveDialog(<NewDashboardDialog />);
}
