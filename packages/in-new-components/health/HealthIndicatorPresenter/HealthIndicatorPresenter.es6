import React from 'react';

import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import SvgIcon from 'in-components/SvgIcon';

import locals from './HealthIndicatorPresenter.mless';

export default function HealthIndicator({ openIssues, maxSeverity }) {
  const color = maxSeverity > 0 ? getDesignLibraryColorBySeverity(maxSeverity) : '#92A5AE';

  return (
    <div className={locals.badge} style={{ color }}>
      <SvgIcon type="lib_events_inverted" width={24} color={color} className={locals.icon} />
      {openIssues}
    </div>
  );
}
