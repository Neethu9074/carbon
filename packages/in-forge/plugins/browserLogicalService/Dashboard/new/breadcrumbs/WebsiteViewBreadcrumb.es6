import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { websitePath } from 'in-stores/navigation/paths/mainPaths';
import { getView } from 'in-stores/navigation';

export default function WebsiteViewBreadcrumb() {
  return <Breadcrumb href$={getView(websitePath)}>Websites</Breadcrumb>;
}
