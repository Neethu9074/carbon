import React from 'react';

import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

export default function ViewBreadcrumb({ viewId, mobileAppId }) {
  return (
    <Breadcrumb href$={getLinkToMobileApp(mobileAppId, { viewId })} label="View" icon="lib_mobile_app_view">
      {viewId}
    </Breadcrumb>
  );
}
