import React from 'react';

import { setActiveDialog } from 'in-components/DialogPresenter/store';
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
    setActiveDialog(getCodeView(snapshot, file, line));
  }
}
