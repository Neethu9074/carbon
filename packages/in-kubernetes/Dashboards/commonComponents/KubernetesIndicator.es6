import React from 'react';

import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';

import icons from 'in-components/SvgIcon/registry.json';

export default function KubernetesIndicator() {
  return <TechnologyLabelWithIcon path={icons.lib_kubernetes.path} label="Kubernetes" />;
}
