import React from 'react';

import NavigationRoutes from 'in-sdk/components/dashboard/TabView/components/NavigationRoutes';
import NavigationTabs from 'in-sdk/components/dashboard/TabView/components/NavigationTabs';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { navigationParameters$ } from 'in-stores/navigation';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import invariant from 'invariant';

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
      <Sticky
        header={
          <div>
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            <BreadcrumbHeader theme="dark" useFullAvailableWidth />
          </div>
        }
      >
        <Sticky header={<NavigationTabs navigationParams={navigationParams} tabs={tabs} />}>
          <NavigationRoutes tabs={tabs} props={props} />
        </Sticky>
      </Sticky>
    );
  }
);
