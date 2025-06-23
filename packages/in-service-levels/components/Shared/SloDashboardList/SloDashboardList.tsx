/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Spacer } from '@instana/components';

import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import { applicationDashboard } from 'in-applications/navigation/paths';
import { serviceLevelsRoot } from 'in-service-levels/navigation/path';
import { syntheticsDashboard } from 'in-synthetics/navigation/paths';
import SloList from 'in-service-levels/components/SloList/SloList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';

const viewPathMap = {
  [syntheticsDashboard]: { path: '/synthetic', key: 'testId' },
  [websitePathFullyQualified]: { path: '/website', key: 'websiteId' },
  [applicationDashboard]: { path: '/application', key: 'appId' }
};

interface SloDashboardListProps {
  viewPath: string;
  location: Location;
}
function SloDashboardList({ viewPath, location }: SloDashboardListProps) {
  if (!viewPathMap[viewPath]) {
    return null;
  }
  const { path, key } = viewPathMap[viewPath];
  const entityIds = getMatrixParameter(location, path, key) ?? '';
  const showEntityInfo = viewPath === syntheticsDashboard;
  return (
    <>
      <SloList pathSegment={serviceLevelsRoot} entityIds={entityIds} isDashboard showEntityInfo={showEntityInfo} />
      <Spacer vertical="xlarge" />
    </>
  );
}

export default SloDashboardList;
