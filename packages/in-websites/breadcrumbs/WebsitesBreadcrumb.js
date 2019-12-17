import React from 'react';

import { websitesPathFullyQualified } from 'in-websites/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getView } from 'in-stores/navigation';

export default function WebsitesBreadcrumb() {
  return <Breadcrumb href$={getView(websitesPathFullyQualified)}>Websites</Breadcrumb>;
}
