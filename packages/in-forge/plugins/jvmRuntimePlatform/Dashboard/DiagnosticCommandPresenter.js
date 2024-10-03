/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DiagnosticCommandOverlayPresenter from './DiagnosticCommandOverlayPresenter';
import DropdownButton from 'in-components/Button/DropdownButton';
import Overlay from 'in-components/overlays/Overlay';

import locals from './DiagnosticCommandPresenter.mless';

export default function DiagnosticCommandPresenter(props) {
  return (
    <Overlay withoutWrapper content={DiagnosticCommandOverlayPresenter} props={props}>
      {({ toggle, isOpen, refSetter }) => (
        <DropdownButton
          expanded={isOpen}
          onClick={toggle}
          refSetter={refSetter}
          kind="secondary"
          className={locals.button}
          size="normal"
        >
          Get diagnostic info
        </DropdownButton>
      )}
    </Overlay>
  );
}
