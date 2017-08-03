import React from 'react';

import SwitchableViewHeader from 'in-sdk/components/dashboard/SwitchableView/components/SwitchableViewHeader';
import NavigationRoutes from 'in-sdk/components/dashboard/SwitchableView/components/NavigationRoutes';
import BreadcrumbHelmet from 'in-sdk/components/dashboard/SwitchableView/components/BreadcrumbHelmet';
import NavigationTabs from 'in-sdk/components/dashboard/SwitchableView/components/NavigationTabs';
import { getSnapshotDefinition } from 'in-sdk/snapshot/registry';
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

    if (__DEV__) {
      invariant(Array.isArray(navigation), 'navigation structure must be an array');
      invariant(typeof snapshot === 'object', 'snapshot must be defined');
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

    const snapshotDefinition = getSnapshotDefinition(snapshot.get('plugin'));
    const pluginContext = snapshotDefinition.pluginContext;
    if (__DEV__) {
      const pluginContextError =
        'a plugincontext must be defined in the index of the dashboard. it must be an object containing a label and the path as attributes';
      invariant(pluginContext != null, `plugin context is null, ${pluginContextError}`);
      invariant(typeof pluginContext === 'object', `plugin context is not an object, ${pluginContextError}`);
      invariant(
        pluginContext.label != null || typeof pluginContext.label === 'string',
        `label is null or not a string, ${pluginContextError}`
      );
      invariant(
        pluginContext.path != null || typeof pluginContext.path === 'string',
        `path is null or not a string, ${pluginContextError}`
      );
    }

    return (
      <div className={block}>
        <SwitchableViewHeader snapshot={snapshot} navigationParams={navigationParams} navigation={navigation} />

        <BreadcrumbHelmet context={pluginContext} />
        <NavigationTabs navigationParams={navigationParams} navigation={navigation} />
        <div className={`${block}__content`}>
          <NavigationRoutes navigationStructure={navigation} {...props} />
        </div>
      </div>
    );
  }
);
