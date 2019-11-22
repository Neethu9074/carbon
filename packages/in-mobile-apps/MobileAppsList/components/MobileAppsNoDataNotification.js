import React from 'react';

import { newMobileAppPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';

export default function MobileAppsNoDataNotification() {
  return <RedirectWithHash to={newMobileAppPathFullyQualified} />;
}
