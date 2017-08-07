import React from 'react';

import NavigationRoutes from 'in-sdk/components/dashboard/TabView/components/NavigationRoutes';
import BreadcrumbHeader from 'in-sdk/components/dashboard/TabView/components/BreadcrumbHeader';
import NavigationTabs from 'in-sdk/components/dashboard/TabView/components/NavigationTabs';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import { navigationParameters$ } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';
import invariant from 'invariant';

import './TabView.less';

const block = 'in-dashboard-tab-view';
export default connectTo(
  {
    navigationParams: navigationParameters$
  },
  function TabView({ tabs, navigationParams, props, breadcrumbs }) {
    if (navigationParams == null) {
      return null;
    }

    if (__DEV__) {
      invariant(Array.isArray(tabs), 'navigation structure must be an array');
      invariant(tabs.length > 0, 'navigation structure may not be empty');
      tabs.forEach(tab => {
        invariant(typeof tab === 'object', 'tab content must be of type object');
        invariant(tab.label != null, 'label must be set');
        invariant(tab.path != null, 'path must be set');
        invariant(tab.component != null, 'component must be set');

        invariant(typeof tab.label === 'string', 'label must be a string');
        invariant(typeof tab.path === 'string', 'path must be a string');
        invariant(typeof tab.component === 'function', 'component must be a react component');
      });
    }

    return (
      <div className={block}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

        <BreadcrumbHeader />

        <NavigationTabs navigationParams={navigationParams} tabs={tabs} />
        <div className={`${block}__content`}>
          <NavigationRoutes tabs={tabs} props={props} />
        </div>
      </div>
    );
  }
);
