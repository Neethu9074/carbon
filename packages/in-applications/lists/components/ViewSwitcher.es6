import React from 'react';

import { applicationsList, servicesList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import TabList from 'in-new-components/TabView/sharedComponents/TabList';
import Tab from 'in-new-components/TabView/sharedComponents/Tab';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ViewSwitcher.mless';

export default connectTo(
  {
    isServiceViewActive: isView(servicesList)
  },
  function AppViewSwitcher({ isServiceViewActive }) {
    return (
      <div className={locals.viewSwitcher}>
        <TabList>
          <Link className={locals.link} href$={getModifiedUrlStream(p => (p.pathname = applicationsList))}>
            <Tab className={locals.tab} isSelected={!isServiceViewActive}>
              Applications
            </Tab>
          </Link>
          <Link className={locals.link} href$={getModifiedUrlStream(p => (p.pathname = servicesList))}>
            <Tab className={locals.tab} isSelected={isServiceViewActive}>
              Services
            </Tab>
          </Link>
        </TabList>
      </div>
    );
  }
);
