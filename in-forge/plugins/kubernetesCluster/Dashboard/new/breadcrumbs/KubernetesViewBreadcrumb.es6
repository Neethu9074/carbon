import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { buildUrlStream } from 'in-stores/navigation';

export default function KubernetesViewBreadcrumb() {
  return (
    <Breadcrumb href$={buildUrlStream({ path: '/kubernetes' })}>
      Kubernetes Cluster
    </Breadcrumb>
  );
}
