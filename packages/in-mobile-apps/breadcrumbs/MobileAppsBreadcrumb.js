import React from 'react';

import { mobileAppsPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getView } from 'in-stores/navigation';

export default function MobileAppsBreadcrumb() {
  return <Breadcrumb href$={getView(mobileAppsPathFullyQualified)}>Mobile Apps</Breadcrumb>;
}
