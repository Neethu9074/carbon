/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { withProps, compose } from 'recompose';
import React from 'react';

import DashboardSwitcherPresenter from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcherPresenter';
import { viewPathFullyQualified, dashboardIdUrlParameter } from 'in-custom-dashboards/navigation/url';
import NewDashboardDialog from 'in-custom-dashboards/NewDashboardDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getCustomDashboards } from 'in-custom-dashboards/api';
import { navigationParameters$ } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

const systemOverviewTitle = 'Instana';
const loadingTitle = 'Loading…';

export default compose(
  connectTo({
    result: getCustomDashboards(),
    navigationParameters: navigationParameters$
  }),
  withProps(({ result, navigationParameters, titleOverwrite }) => ({
    ...determineActiveDashboard(result, navigationParameters, titleOverwrite),
    isLoadingMore: result.progress.loading,
    customDashboards: result && result.data,
    onCreateNewDashboard
  }))
)(DashboardSwitcherPresenter);

function determineActiveDashboard(result, navigationParameters, titleOverwrite) {
  const activeDashboard = {
    activeDashboardTitle: loadingTitle,
    isCockpit: false
  };

  if (titleOverwrite) {
    activeDashboard.activeDashboardTitle = titleOverwrite;
  } else if (navigationParameters.pathname !== viewPathFullyQualified) {
    activeDashboard.activeDashboardTitle = systemOverviewTitle;
    activeDashboard.isCockpit = true;
  } else if (result.data) {
    const customDashboardId = getMatrixParameter(
      navigationParameters,
      dashboardIdUrlParameter.path,
      dashboardIdUrlParameter.name
    );

    if (customDashboardId) {
      for (let i = 0; i < result.data.length; i++) {
        const customDashboard = result.data[i];
        if (customDashboard.id === customDashboardId) {
          activeDashboard.activeDashboardTitle = customDashboard.title;
          break;
        }
      }
    }
  }

  return activeDashboard;
}

function onCreateNewDashboard() {
  addActiveDialog(<NewDashboardDialog />);
}
