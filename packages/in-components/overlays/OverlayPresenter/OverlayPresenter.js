/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import OverlayCloseIdentification from 'in-components/overlays/OverlayPresenter/OverlayCloseIdentification';
import SingleOverlayPresenter from 'in-components/overlays/OverlayPresenter/SingleOverlayPresenter';
import { overlays$ } from 'in-components/overlays/overlayStore';

export default function OverlayPresenter() {
  const overlays = useObservable(overlays$, []);
  return (
    <>
      <OverlayCloseIdentification overlays={overlays} />
      {overlays?.map(overlay => (
        <SingleOverlayPresenter key={overlay.id} {...overlay} />
      ))}
    </>
  );
}
