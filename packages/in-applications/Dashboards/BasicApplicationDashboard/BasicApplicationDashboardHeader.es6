import React from 'react';

import Skeleton from 'in-components/Progress/Skeleton';

import locals from './BasicApplicationDashboardHeader.mless';

export default function BasicApplicationDashboardHeader({ type, label }) {
  return (
    <div className={locals.basicDashboardHeader}>
      {type ? <span className={locals.type}>{type}</span> : 'unknown'}
      {label ? <span className={locals.label}>{label}</span> : <Skeleton style={{ height: 12, width: 100 }} />}
    </div>
  );
}
