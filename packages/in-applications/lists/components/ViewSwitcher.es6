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
    numApplications: timeConfig$
      .flatMap(timeConfig => getApplications(getApplicationListSubscribeEvent(timeConfig)))
      .map(mapResultToItemLength)
      .startWith(null),
    numServices: timeConfig$
      .flatMap(timeConfig => getServices(getServiceListSubscribeEvent(timeConfig)))
      .map(mapResultToItemLength)
      .startWith(null)
  },
  function AppViewSwitcher({ isServiceViewActive, numApplications, numServices }) {
    return (
      <div className={locals.viewSwitcher}>
        <TabList>
          <Link className={locals.link} href$={getModifiedUrlStream(p => (p.pathname = applicationsList))}>
            <Tab className={locals.tab} isSelected={!isServiceViewActive}>
              Applications
              {numApplications && <span className={locals.numberItemsIndicator}>{`(${numApplications})`}</span>}
            </Tab>
          </Link>
          <Link className={locals.link} href$={getModifiedUrlStream(p => (p.pathname = servicesList))}>
            <Tab className={locals.tab} isSelected={isServiceViewActive}>
              Services
              {numServices && <span className={locals.numberItemsIndicator}>{`(${numServices})`}</span>}
            </Tab>
          </Link>
        </TabList>
      </div>
    );
  }
);

function mapResultToItemLength(result) {
  return result.data != null && result.data.items != null ? result.data.items.length : null;
}
