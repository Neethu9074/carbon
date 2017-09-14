import React from 'react';

import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';

export default function KubernetesHeading({ numClusters, className }) {
  return (
    <FullscreenViewHeading className={className} iconType="kubernetes" count={numClusters}>
      Kubernetes Clusters
    </FullscreenViewHeading>
  );
}
