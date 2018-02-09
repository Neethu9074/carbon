import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { servicesPath } from 'in-stores/navigation/paths/mainPaths';
import { getView } from 'in-stores/navigation';

export default function ApplicationViewBreadcrumb() {
  return <Breadcrumb href$={getView(servicesPath)}>Services</Breadcrumb>;
}
