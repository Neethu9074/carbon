import React from 'react';

import { getApplicationListSubscribeEvent } from 'in-applications/lists/ApplicationsList';
import { getServiceListSubscribeEvent } from 'in-applications/lists/ServicesList';
import { applicationsList, servicesList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import getApplications from 'in-subscription/application/getApplications';
import TabList from 'in-new-components/TabView/sharedComponents/TabList';
import getServices from 'in-subscription/application/getServices';
import Tab from 'in-new-components/TabView/sharedComponents/Tab';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ViewSwitcher.mless';

export default connectTo(
  {
    isServiceViewActive: isView(servicesList),
    applicationCount: timeConfig$
      .flatMap(timeConfig => getApplications(getApplicationListSubscribeEvent(timeConfig)))
      .map(result => (result.data != null && result.data.items != null ? result.data.totalHits : null)),
    serviceCount: timeConfig$
      .flatMap(timeConfig => getServices(getServiceListSubscribeEvent(timeConfig)))
      .map(result => (result.data != null && result.data.items != null ? result.data.totalHits : null))
  },
  function AppViewSwitcher({ isServiceViewActive, applicationCount, serviceCount }) {
    return (
      <div className={locals.viewSwitcher}>
        <TabList>
          <Link className={locals.link} href$={getModifiedUrlStream(p => (p.pathname = applicationsList))}>
            <Tab className={locals.tab} isSelected={!isServiceViewActive}>
              Applications {applicationCount ? `(${applicationCount})` : null}
            </Tab>
          </Link>
          <Link className={locals.link} href$={getModifiedUrlStream(p => (p.pathname = servicesList))}>
            <Tab className={locals.tab} isSelected={isServiceViewActive}>
              Services {serviceCount ? `(${serviceCount})` : null}
            </Tab>
          </Link>
        </TabList>
      </div>
    );
  }
);
