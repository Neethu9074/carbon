import React from 'react';

import SwitchableViewHeader from 'in-sdk/components/dashboard/SwitchableView/components/SwitchableViewHeader';
import NavigationRoutes from 'in-sdk/components/dashboard/SwitchableView/components/NavigationRoutes';
import NavigationTabs from 'in-sdk/components/dashboard/SwitchableView/components/NavigationTabs';
import { navigationParameters$ } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';
import invariant from 'invariant';

import './SwitchableView.less';

const block = 'in-switchable-view';
export default connectTo(
  {
    navigationParams: navigationParameters$
  },
  function SwitchableView(props) {
    const { navigation, navigationParams } = props;
    if (navigationParams == null) {
      return null;
    }

    if (__DEV__) {
      invariant(Array.isArray(navigation), 'navigation structure must be an array');
      invariant(navigation.length > 0, 'navigation structure may not be empty');
      navigation.forEach(nav => {
        invariant(typeof nav === 'object', 'navigation content must be of type object');
        invariant(nav.label != null, 'label must be set');
        invariant(nav.path != null, 'path must be set');
        invariant(nav.component != null, 'component must be set');

        invariant(typeof nav.label === 'string', 'label must be a string');
        invariant(typeof nav.path === 'string', 'path must be a string');
        invariant(typeof nav.component === 'function', 'component must be a react component');
      });
    }

    return (
      <div className={block}>
        <SwitchableViewHeader />

        <NavigationTabs navigationParams={navigationParams} navigationStructure={navigation} />
        <div className={`${block}__content`}>
          <NavigationRoutes navigationStructure={navigation} {...props} />
        </div>
      </div>
    );
  }
);
