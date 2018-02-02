import React from 'react';

import Skeleton from 'in-components/Progress/Skeleton';

import locals from './BasicApplicationDashboardHeader.mless';

export default function BasicApplicationDashboardHeader({ result, className, children }) {
  const isLoading = result.progress.loading;
  const label = isLoading ? null : result.data.label;

  let block = locals.basicDashboardHeader;

  if (className != null) {
    block += ` ${className}`;
  }
  return (
    <div className={block}>
      {!isLoading ? <span className={locals.label}>{label}</span> : <Skeleton style={{ height: 18, width: 100 }} />}
      {!isLoading ? children : null}
    </div>
  );
}
