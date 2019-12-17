import React from 'react';

import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ mobileAppId, timeConfig }) => ({
    mobileApp: getMobileApp({
      id: mobileAppId,
      timeConfig
    })
  }),
  function MobileAppBreadcrumb({ mobileApp, mobileAppId }) {
    return (
      <Breadcrumb href$={getLinkToMobileApp(mobileAppId, { viewId: null })} label="Mobile App" icon="lib_mobile_app">
        {mobileApp.data && mobileApp.data.label}
      </Breadcrumb>
    );
  }
);
