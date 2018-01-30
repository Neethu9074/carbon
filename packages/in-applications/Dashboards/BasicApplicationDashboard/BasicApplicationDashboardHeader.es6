import React from 'react';

import Skeleton from 'in-components/Progress/Skeleton';

import locals from './BasicApplicationDashboardHeader.mless';

export default function BasicApplicationDashboardHeader({ type, result }) {
  const isLoading = result.progress.loading;
  const label = isLoading ? null : result.data.label;

  return (
    <div className={locals.basicDashboardHeader}>
      {type ? <span className={locals.type}>{type}</span> : 'unknown'}
      {!isLoading ? <span className={locals.label}>{label}</span> : <Skeleton style={{ height: 18, width: 100 }} />}
    </div>
  );
}
