import React from 'react';

import NavigationTabs from 'in-sdk/components/dashboard/SwitchableView/components/NavigationTabs';
import NavigationRoutes from 'in-sdk/components/dashboard/SwitchableView/components/NavigationRoutes';
import SwitchableViewHeader from 'in-sdk/components/dashboard/SwitchableView/components/SwitchableViewHeader';

import { navigationParameters$ } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

import './SwitchableView.less';

const block = 'in-switchable-view';
export default connectTo(
  {
    navigationParams: navigationParameters$
  },
  function SwitchableView({ navigation, navigationParams }) {
    if (navigationParams == null) {
      return null;
    }

    return (
      <div className={`${block}`}>
        <SwitchableViewHeader />

        <NavigationTabs navigationParams={navigationParams} navigationStructure={navigation} />
        <div className={`${block}__content`}>
          <NavigationRoutes navigationStructure={navigation} />
        </div>
      </div>
    );
  }
);
