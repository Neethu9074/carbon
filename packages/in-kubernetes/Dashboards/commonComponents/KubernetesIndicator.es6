import React from 'react';
import { get } from 'lodash';

import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';

import icons from 'in-components/SvgIcon/registry.json';

export default function KubernetesIndicator({ result }) {
  const distributionType = get(result, ['data', 'distributionType'], 'Kubernetes');
  const iconPath = icons[`lib_${distributionType.toLowerCase()}`].path;
  return <TechnologyLabelWithIcon path={iconPath} label={distributionType} />;
}
