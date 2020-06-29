import React from 'react';

import locals from 'in-new-components/overlays/OverlayPresenter/SingleOverlayPresenter.mless';
import {joinClassNames} from 'in-services/util/classnames';

export default function PermanentlyVisibleOverlay({children}) {
  return (
    <div className={joinClassNames(locals['style--popover'], locals.overlay)} style={{position: 'static', display: 'inline-block'}}>
      {children}
    </div>
  );
}
