/* global require:false */
import React from 'react';

import TabView from 'in-sdk/components/dashboard/TabView';

export default function DashboardContent({ data, type }) {
  // TODO: replace how implementations are fetched when discussed
  let dashboardConfig;
  if (type === 'service') {
    dashboardConfig = require(`../implementations/service/index.es6`).default;
  } else {
    dashboardConfig = require(`../implementations/application/index.es6`).default;
  }

  return <TabView tabs={dashboardConfig.tabs} props={data} breadcrumbs={dashboardConfig.breadcrumbs} />;
}
