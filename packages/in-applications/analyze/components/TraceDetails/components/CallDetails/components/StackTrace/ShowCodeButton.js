/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { supportsCodeView, getCodeView } from 'in-sdk/snapshot';

export default function ShowCodeButton({ snapshot, file, line, children }) {
  if (!supportsCodeView(snapshot, file)) {
    return children;
  }

  return (
    <a href="" onClick={showCodeView}>
      {children}
    </a>
  );

  function showCodeView(e) {
    e.preventDefault();
    e.stopPropagation();
    addActiveDialog(getCodeView(snapshot, file, line));
  }
}
