/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import NewDashboardDialog from 'promise-loader?global,inCustomDashboards!in-custom-dashboards/NewDashboardDialog';
import React from 'react';

import { useObservable } from '@instana/hooks';

import DashboardSwitcherPresenter from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcherPresenter';
import { dashboardIdUrlParameter, viewPathFullyQualified } from 'in-custom-dashboards/navigation/url';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getCustomDashboards } from 'in-custom-dashboards/api';
import { navigationParameters$ } from 'in-stores/navigation';
import { t } from 'in-i18n';

const systemOverviewTitle = 'Instana';
const loadingTitle = t('in-custom-dashboards:dashboardSwitcher.dashboardSwitcher.loading');

const DeferredNewDashboardDialog = createAsyncViewComponent(NewDashboardDialog);
export default function DashboardSwitcher({ titleOverwrite }) {
  const result = useObservable(getCustomDashboards, []);
  const navigationParameters = useObservable(navigationParameters$, []);

  if (!result || !navigationParameters) return null;

  const presenterProps = {
    ...determineActiveDashboard(result, navigationParameters, titleOverwrite),
    isLoadingMore: result.progress.loading,
    customDashboards: result && result.data,
    onCreateNewDashboard
  };

  return <DashboardSwitcherPresenter activeDashboardTitle={titleOverwrite} {...presenterProps} />;
}
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
  addActiveDialog(<DeferredNewDashboardDialog />);
}
