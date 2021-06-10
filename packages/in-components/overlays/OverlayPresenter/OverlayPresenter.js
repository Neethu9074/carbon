/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SingleOverlayPresenter from 'in-components/overlays/OverlayPresenter/SingleOverlayPresenter';
import CloseWrapper from 'in-components/overlays/OverlayPresenter/CloseWrapper';
import { overlays$ } from 'in-components/overlays/overlayStore';
import connect from 'in-hoc/connectTo';

export default connect({
  overlays: overlays$
})(function OverlayPresenter({ overlays }) {
  return (
    <CloseWrapper overlays={overlays}>
      {overlays.map(overlay => (
        <SingleOverlayPresenter key={overlay.id} {...overlay} />
      ))}
    </CloseWrapper>
  );
});
