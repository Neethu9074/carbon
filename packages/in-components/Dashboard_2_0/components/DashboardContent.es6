/* global require:false */
import React from 'react';

import TabView from 'in-sdk/components/dashboard/TabView';

export default function DashboardContent({ match }) {
  // TODO: replace how implementations are fetched when discussed
  let dashboardConfig;
  if (match.url.indexOf('/application/services/dashboard') === 0) {
    dashboardConfig = require(`../implementations/service/index.es6`).default;
  } else {
    dashboardConfig = require(`../implementations/application/index.es6`).default;
  }

  return <TabView tabs={dashboardConfig.tabs} props={{}} breadcrumbs={dashboardConfig.breadcrumbs} />;
}
