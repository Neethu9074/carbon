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
    const { navigation, navigationParams, snapshot } = props;
    if (navigationParams == null) {
      return null;
    }

    const currentNavigation = navigation[navigationParams.pathname];

    if (__DEV__) {
      invariant(typeof navigation === 'object', 'navigation structure must be an object');
      invariant(Object.keys(navigation).length > 0, 'navigation structure may not be empty');
      Object.keys(navigation).forEach(key => {
        const nav = navigation[key];
        invariant(typeof nav === 'object', 'navigation content must be of type object');
        invariant(nav.label != null, 'label must be set');
        invariant(
          typeof nav.label === 'string' || typeof nav.label === 'function',
          'label must be either a string or a function'
        );

        if (nav.tabs != null) {
          invariant(Array.isArray(nav.tabs), 'navigation tab structure must be an array');
          nav.tabs.forEach(tab => {
            invariant(tab.path != null, 'path must be set');
            invariant(tab.component != null, 'component must be set');

            invariant(typeof tab.path === 'string', 'path must be a string');
            invariant(typeof tab.component === 'function', 'component must be a react component');
          });
        }

        invariant(
          currentNavigation != null,
          `The current path ${navigationParams.pathname} does not match to any given tab configuration.`
        );
      });
    }

    //we didn't find any matches for the current path
    if (currentNavigation == null) {
      return null;
    }

    return (
      <div className={block}>
        <SwitchableViewHeader snapshot={snapshot} navigationParams={navigationParams} navigation={navigation} />

        <NavigationTabs navigationParams={navigationParams} navigation={currentNavigation} />
        <div className={`${block}__content`}>
          <NavigationRoutes navigationStructure={currentNavigation} {...props} />
        </div>
      </div>
    );
  }
);
