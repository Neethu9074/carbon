import React from 'react';

import VersionSwitcherFlyout from 'in-components/AppHeader/components/VersionSwitcher/VersionSwitcherFlyout';
import { isTwoZeroBetaPhase, twoZeroModeEnabled } from 'in-services/featureFlags';
import { evaluateClassNames } from 'in-services/util/classnames';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';

import locals from './VersionSwitcher.mless';

export default function VersionSwitcher() {
  if (!isTwoZeroBetaPhase) {
    return null;
  }

  return (
    <div className={locals.switcher}>
      <Overlay content={VersionSwitcherFlyout} withoutWrapper>
        {OverlayActivation}
      </Overlay>

      <span className={locals.state}>{twoZeroModeEnabled ? 'Application 2.0' : 'Application 1.0'}</span>

      {twoZeroModeEnabled && <span className={locals.beta}>Beta</span>}
    </div>
  );
}

function OverlayActivation({ refSetter, toggle, isOpen }) {
  return (
    <SvgIcon
      type="lib_arrow_drop_down"
      className={evaluateClassNames({
        [locals.arrow]: true,
        [locals.active]: isOpen
      })}
      width={24}
      refSetter={refSetter}
      onClick={toggle}
    />
  );
}
