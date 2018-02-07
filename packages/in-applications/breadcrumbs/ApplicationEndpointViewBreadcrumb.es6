import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { endpointDashboard } from 'in-applications/navigation/paths';
import { getView } from 'in-stores/navigation';

export default function ApplicationEndpointViewBreadcrumb() {
  return <Breadcrumb href$={getView(endpointDashboard)}>Endpoint</Breadcrumb>;
}
