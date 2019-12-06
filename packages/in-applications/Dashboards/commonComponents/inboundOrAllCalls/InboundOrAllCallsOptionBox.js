import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import OptionBox from 'in-applications/components/OptionBox';
import { boundaryScopes } from 'in-applications/constants';

import locals from './InboundOrAllCallsChoiceHorizontal.mless';

export default function InboundOrAllCallsOptionBox({ boundaryScope, onBoundaryStateChange, scope }) {
  const { icon, text, dashboard } = boundaryScopes.info[scope];
  return (
    <OptionBox
      icon={icon}
      title={text}
      asRadioButton
      className={evaluateClassNames({
        [locals.optionBox]: true,
        [locals.optionBoxUnchecked]: scope !== boundaryScope
      })}
      description={dashboard}
      checked={scope === boundaryScope}
      onChange={() => onBoundaryStateChange({ boundaryScope: scope })}
    />
  );
}
