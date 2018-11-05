import React from 'react';

import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import SvgIcon from 'in-components/SvgIcon';

import locals from './HealthIndicatorPresenter.mless';

export default function HealthIndicatorPresenter({ openIssues, maxSeverity, active, refSetter, onClick }) {
  if (openIssues == 0) {
    return <SvgIcon type="lib_check" width={24} className={locals.okayIcon} />;
  }

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
      <SvgIcon type="lib_help_error_warning" width={24} color={color} className={locals.icon} />
      {openIssues}
    </a>
  );
}
