import React from 'react';

import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import SvgIcon from 'in-components/SvgIcon';

import locals from './HealthIndicatorPresenter.mless';

export default function HealthIndicatorPresenter({ openIssues, maxSeverity, active, refSetter, onClick }) {
  let color = getDesignLibraryColorBySeverity(maxSeverity);
  if (active) {
    color = '#031F29';
  }

  return (
    <a
      href=""
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={locals.badge}
      ref={refSetter}
    >
      <SvgIcon type="lib_events_inverted" width={24} color={color} className={locals.icon} />
      {openIssues}
    </a>
  );
}
