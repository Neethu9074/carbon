import React from 'react';

import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import SvgIcon from 'in-components/SvgIcon';

import locals from './HealthIndicatorBadgePresenter.mless';

export default function HealthIndicatorBadgePresenter({ openIssues, maxSeverity, active }) {
  let color = getDesignLibraryColorBySeverity(maxSeverity);
  if (active) {
    color = '#031F29';
  }

  return (
    <div className={locals.badge} style={{ background: color }}>
      <SvgIcon type="lib_events_inverted" width={24} color="#fff" className={locals.icon} />
      {openIssues}
    </div>
  );
}
