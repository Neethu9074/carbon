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
    <Overlay content={VersionSwitcherFlyout} autoOpen autoClose={false} withoutWrapper>
      {OverlayActivation}
    </Overlay>
  );
}

function OverlayActivation({ refSetter, isOpen, delayedOpen, delayedClose }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.switcher]: true,
        [locals.active]: isOpen
      })}
      ref={refSetter}
      onMouseEnter={delayedOpen}
      onMouseLeave={delayedClose}
    >
      <SvgIcon
        type="lib_arrow_drop_down"
        className={evaluateClassNames({
          [locals.arrow]: true,
          [locals.active]: isOpen
        })}
        width={24}
      />
      <span className={locals.state}>{twoZeroModeEnabled ? 'Application Perspectives' : 'Legacy Mode'}</span>
      {twoZeroModeEnabled && <span className={locals.beta}>New</span>}
    </div>
  );
}
