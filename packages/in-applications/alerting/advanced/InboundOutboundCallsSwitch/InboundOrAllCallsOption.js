import React from 'react';

import { boundaryScopes } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import classNames from 'classnames';
import OptionBox from 'in-applications/components/OptionBox';

import locals from './InboundOrAllCallsSwitch.mless';

export default function InboundOrAllCallsOption({ boundaryScope, onBoundaryStateChange, scope }) {
  const { icon, text, dashboard } = boundaryScopes.info[scope];
  return (
    <OptionBox
      icon={icon}
      title={text}
      asRadioButton
      className={classNames({
        [locals.optionBox]: true,
        [locals.optionBoxUnchecked]: scope !== boundaryScope
      })}
      description={dashboard}
      checked={scope === boundaryScope}
      onChange={() => onBoundaryStateChange({ boundaryScope: scope })}
    />
  );
}
