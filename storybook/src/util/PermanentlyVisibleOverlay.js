/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import locals from 'in-new-components/overlays/OverlayPresenter/SingleOverlayPresenter.mless';

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
