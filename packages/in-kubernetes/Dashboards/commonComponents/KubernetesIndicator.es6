import React from 'react';

import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';
import { plugins } from 'in-forge/constants';

export default function KubernetesIndicator() {
  return <TechnologyLabelWithIcon plugin={plugins.kubernetesCluster} label="Kubernetes" />;
}
