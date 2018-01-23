import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { servicesList } from 'in-applications/navigation/paths';
import { getView } from 'in-stores/navigation';

export default function ApplicationServiceViewBreadcrumb() {
  return <Breadcrumb href$={getView(servicesList)}>Services</Breadcrumb>;
}
