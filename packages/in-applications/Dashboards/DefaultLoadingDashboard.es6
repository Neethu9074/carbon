import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import Skeleton from 'in-components/Progress/Skeleton';

import locals from './DefaultLoadingDashboard.mless';

export default function DefaultLoadingDashboard() {
  return [
    <Columize key={0}>
      <DashboardSection title="Some Chart">
        <Skeleton className={locals.skeleton} />
      </DashboardSection>
      <DashboardSection title="Technology Breakdown">
        <div className={locals.skeletonChart} />
      </DashboardSection>
    </Columize>,
    <DashboardSection key={1}>
      <Columize>
        <div className={locals.skeletonChart} />
        <div className={locals.skeletonChart} />
      </Columize>
    </DashboardSection>
  ];
}
