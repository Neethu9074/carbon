import React from 'react';

import NavigationTabs from 'in-sdk/components/dashboard/SwitchableView/NavigationTabs';
import NavigationRoutes from 'in-sdk/components/dashboard/SwitchableView/NavigationRoutes';
import SwitchableViewHeader from 'in-sdk/components/dashboard/SwitchableView/SwitchableViewHeader';

import { navigationParameters$ } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

import './SwitchableView.less';

const block = 'in-switchable-view';
export default connectTo(
  {
    navigationParams: navigationParameters$
  },
  function TabNavigation({ navigation, snapshot, navigationParams }) {
    if (navigationParams == null) {
      return null;
    }

    return (
      <div  className={`${block}`}>
        <SwitchableViewHeader/>

        <NavigationTabs
          navigationParams={navigationParams}
          navigationStructure={navigation}
        />
        <div className={`${block}__content`}>
          <NavigationRoutes
            navigationStructure={navigation}
          />
        </div>
      </div>
    );
  }
);


