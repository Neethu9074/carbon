import React from 'react';

import { SIGNALS } from 'in-new-components/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-new-components/ApplicationMap/serviceLocator/serviceLocator';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import connectTo from 'in-hoc/connectTo';

import locals from './LayoutingLoadingScreen.mless';

export default connectTo(
  ({ serviceLocatorUid }) => ({
    isLayouting: getServiceLocators(serviceLocatorUid)
      .eventBusServiceLocator.on(SIGNALS.IS_LAYOUTING)
      .throttle(400)
  }),
  function LayoutingLoadingScreen({ isLayouting }) {
    if (!isLayouting) {
      return null;
    }
    return (
      <div className={locals.wrapper}>
        <InfiniteCircle customText="Layouting" />;
      </div>
    );
  }
);
