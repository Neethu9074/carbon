import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { buildUrlStream } from 'in-stores/navigation';

export default function ApplicationViewBreadcrumb() {
  return <Breadcrumb href$={buildUrlStream({ path: '/logical' })}>Application</Breadcrumb>;
}
