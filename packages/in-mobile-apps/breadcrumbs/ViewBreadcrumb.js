import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';

export default function ViewBreadcrumb({ viewId, mobileAppId }) {
  return (
    <Breadcrumb href$={getLinkToMobileApp(mobileAppId, { viewId })} label="View" icon="lib_website_page_load">
      {viewId}
    </Breadcrumb>
  );
}
