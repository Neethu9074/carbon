import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';

import locals from './DefaultLoadingDashboard.mless';

export default function DefaultLoadingDashboard() {
  return (
    <div>
      <Columize>
        <DashboardSection title="Some Chart">
          <div className={locals.skeletonChart} />
        </DashboardSection>
        <DashboardSection title="Technology Breakdown">
          <div className={locals.skeletonChart} />
        </DashboardSection>
      </Columize>
      <DashboardSection>
        <Columize>
          <div className={locals.skeletonChart} />
          <div className={locals.skeletonChart} />
        </Columize>
      </DashboardSection>
    </div>
  );
}
