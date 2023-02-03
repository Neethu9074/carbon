/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { dataSourceSources } from 'in-analyze/components/AnalyzeHeader/constants';
import { ActiveConfiguration } from 'in-analyze/components/AnalyzeHeader/types';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Entity } from 'in-analyze/AnalyzeView/dataSources';
import { Location } from 'in-stores/navigation/types';
import { isNotBlank } from 'in-services/util/string';

export function getActiveConfiguration(location: Location): ActiveConfiguration {
  for (const { matrixPath, matrixParam, productArea, pathPrefix } of dataSourceSources) {
    if (pathPrefix && !location.pathname.startsWith(pathPrefix)) {
      continue;
    }

    const dataSource = getMatrixParameter(location, matrixPath, matrixParam) as Entity;
    if (isNotBlank(dataSource)) {
      return {
        productArea,
        dataSource,
        ua2: true,
        beta: dataSource === 'logs' || dataSource === 'infrastructure'
      };
    }
  }

  return {
    productArea: 'application',
    dataSource: 'calls',
    ua2: true
  };
}
