import React from 'react';

import VersionSwitcherFlyout from 'in-components/AppHeader/components/VersionSwitcher/VersionSwitcherFlyout';
import { isTwoZeroBetaPhase, twoZeroModeEnabled } from 'in-services/featureFlags';
import { evaluateClassNames } from 'in-services/util/classnames';
import { homePath } from 'in-stores/navigation/paths/mainPaths';
import { getView } from 'in-stores/navigation/navigation';
import Overlay from 'in-new-components/overlays/Overlay';
import Lettering from 'in-components/Lettering';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './VersionSwitcher.mless';

export default function VersionSwitcher() {
  if (!isTwoZeroBetaPhase) {
    return null;
  }

  return (
    <Overlay content={VersionSwitcherFlyout} autoOpen withoutWrapper>
      {OverlayActivation}
    </Overlay>
  );
}

function OverlayActivation({ refSetter, isOpen, delayedOpen, delayedClose }) {
  return (
    <div ref={refSetter} className={locals.wrapper} onMouseEnter={delayedOpen} onMouseLeave={delayedClose}>
      <Link href$={getView(homePath)} className={locals.lettering}>
        <Lettering />
      </Link>

      <div className={locals.switcher}>
        <SvgIcon
          type="lib_arrow_drop_down"
          className={evaluateClassNames({
            [locals.arrow]: true,
            [locals.active]: isOpen
          })}
          width={24}
        />
        <span className={locals.state}>{twoZeroModeEnabled ? 'Application Perspectives' : 'Old Version'}</span>
        <span className={locals.beta}>{twoZeroModeEnabled ? 'New' : 'Deprecated'}</span>
      </div>
    </div>
  );
}
