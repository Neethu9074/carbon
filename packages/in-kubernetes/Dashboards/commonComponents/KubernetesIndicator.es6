import React from 'react';
import { get } from 'lodash';

import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';

import icons from 'in-components/SvgIcon/registry.json';

export default function KubernetesIndicator({ result }) {
  const solutionType = get(result, ['data', 'solutionType'], 'Kubernetes');
  const icon_path = icons[`lib_${solutionType.toLowerCase()}`].path;
  return <TechnologyLabelWithIcon path={icon_path} label={solutionType} />;
}
