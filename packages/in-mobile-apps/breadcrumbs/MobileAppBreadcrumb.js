import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
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
      <Breadcrumb href$={getLinkToMobileApp(mobileAppId, { pageId: null })} label="Mobile App" icon="lib_website">
        {mobileApp.data && mobileApp.data.label}
      </Breadcrumb>
    );
  }
);
