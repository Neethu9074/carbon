import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { buildUrlStream } from 'in-stores/navigation';

export default function WebsiteViewBreadcrumb() {
  return (
    <Breadcrumb href$={buildUrlStream({ path: '/website' })}>
      Websites
    </Breadcrumb>
  );
}
