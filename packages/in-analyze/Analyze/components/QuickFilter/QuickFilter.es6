import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './QuickFilter.mless';

export default function QuickFilter({ label, onClick, opensOverlay, isOpen, notAvailable, deactivated, helpText }) {
  if (deactivated || notAvailable) {
    return (
      <Tooltip themeStyle="light" content={helpText}>
        <div
          className={evaluateClassNames({
            [locals.quickFilter]: true,
            [locals.deactivated]: deactivated,
            [locals.notAvailable]: notAvailable
          })}
        >
          {label}
          {opensOverlay && <SvgIcon className={locals.icon} type="lib_arrow_expand_down" width={16} height={16} />}
        </div>
      </Tooltip>
    );
  }
  return (
    <div
      className={evaluateClassNames({
        [locals.quickFilter]: true,
        [locals.isOpen]: isOpen
      })}
      onClick={onClick}
    >
      {label}
      {opensOverlay && <SvgIcon className={locals.icon} type="lib_arrow_expand_down" width={16} height={16} />}
    </div>
  );
}
