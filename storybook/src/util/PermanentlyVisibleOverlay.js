import React from 'react';

import locals from 'in-new-components/overlays/OverlayPresenter/SingleOverlayPresenter.mless';
import classNames from 'classnames';

export default function PermanentlyVisibleOverlay({ children }) {
  return (
    <div
      className={classNames(locals['style--popover'], locals.overlay)}
      style={{ position: 'static', display: 'inline-block' }}
    >
      {children}
    </div>
  );
}
