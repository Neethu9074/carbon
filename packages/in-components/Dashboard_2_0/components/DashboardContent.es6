/* global require:false */
import React from 'react';

import BreadcrumbForSnapshot from 'in-sdk/components/dashboard/breadcrumb/BreadcrumbForSnapshot';
import LoadingIndicator from 'in-components/LoadingIndicator';
import TabView from 'in-sdk/components/dashboard/TabView';
import { selectedSnapshot$ } from 'in-stores/snapshot';
import { servicePlugins } from 'in-forge/constants';
import connectTo from 'in-hoc/connectTo';

import locals from './DashboardContent.mless';

export default connectTo(
  {
    snapshot: selectedSnapshot$
  },
  function DashboardContent({ snapshot }) {
    if (!snapshot) {
      return (
        <div className={locals.dashboard}>
          <LoadingIndicator type="dark" />
        </div>
      );
    }

    // TODO: replace how implementations are fetched when discussed
    let dashboardConfig;
    if (servicePlugins[snapshot.get('plugin')]) {
      dashboardConfig = require(`../implementations/service/index.es6`).default;
    } else {
      dashboardConfig = require(`../implementations/application/index.es6`).default;
    }

    return (
      <TabView
        tabs={dashboardConfig.tabs}
        props={{}}
        breadcrumbs={dashboardConfig.breadcrumbs.concat([<BreadcrumbForSnapshot snapshot={snapshot} />])}
      />
    );
  }
);
