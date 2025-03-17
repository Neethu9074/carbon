/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import DashboardSwitcherPresenter from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcherPresenter';

export default {
  component: DashboardSwitcherPresenter
};

export const Default = {
  render: () => (
    <DashboardSwitcherPresenter
      activeDashboardTitle="System Overview"
      customDashboards={[
        {
          id: 'A',
          title: 'Data Ingress'
        },
        {
          id: 'B',
          title: 'Alerting'
        },
        {
          id: 'C',
          title: 'Service-Level Objectives'
        },
        {
          id: 'D',
          title:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et'
        }
      ]}
    />
  ),

  name: 'default'
};

export const Loading = {
  render: () => <DashboardSwitcherPresenter activeDashboardTitle="System Overview" isLoadingMore />,
  name: 'Loading'
};

export const NoCustomDashboards = {
  render: () => <DashboardSwitcherPresenter activeDashboardTitle="System Overview" customDashboards={[]} />,
  name: 'no custom dashboards'
};
