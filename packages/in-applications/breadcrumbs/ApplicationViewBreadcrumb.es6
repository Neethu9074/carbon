import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { applicationsList } from 'in-applications/navigation/paths';
import { getView } from 'in-stores/navigation';

export default function ApplicationViewBreadcrumb() {
  return <Breadcrumb href$={getView(applicationsList)}>Applications</Breadcrumb>;
}
