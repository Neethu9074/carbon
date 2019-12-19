import React from 'react';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import locals from './DashboardHeaderShadowModule.mless';
export default function DashboardHeaderShadowModule() {
  return (
    <>
      <DashboardHeaderModule className={locals.shadowModule} withBottomBorder={false} />
      <DashboardHeaderModule className={locals.spacingModule} withBottomBorder={false} withTopBorder={false} />
    </>
  );
}
