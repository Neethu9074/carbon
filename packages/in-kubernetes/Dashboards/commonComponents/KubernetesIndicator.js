import React from 'react';
import { get } from 'lodash';

import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';
import { capitalize } from 'in-services/formatters/string';

import icons from 'in-components/SvgIcon/registry.json';

export default function KubernetesIndicator({ result }) {
  const clusterDistribution = get(result, ['data', 'clusterDistribution'], 'kubernetes');
  const iconPath = icons[`lib_${clusterDistribution}`].path;
  return <TechnologyLabelWithIcon path={iconPath} label={capitalize(clusterDistribution)} />;
}
