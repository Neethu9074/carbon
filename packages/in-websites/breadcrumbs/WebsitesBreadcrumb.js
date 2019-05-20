import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { websitesPathFullyQualified } from 'in-websites/navigation/paths';
import { getView } from 'in-stores/navigation';

export default function WebsitesBreadcrumb() {
  return <Breadcrumb href$={getView(websitesPathFullyQualified)}>Websites</Breadcrumb>;
}
