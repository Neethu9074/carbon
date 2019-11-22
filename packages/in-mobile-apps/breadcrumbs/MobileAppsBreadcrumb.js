import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { mobileAppsPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import { getView } from 'in-stores/navigation';

export default function MobileAppsBreadcrumb() {
  return <Breadcrumb href$={getView(mobileAppsPathFullyQualified)}>Mobile Apps</Breadcrumb>;
}
