import React from 'react';

import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { supportsCodeView, getCodeView } from 'in-sdk/snapshot';

import './ShowCodeButton.less';

const block = 'in-trace-view-show-code';

export default function ShowCodeButton({ snapshot, file, line }) {
  if (!supportsCodeView(snapshot, file)) {
    return null;
  }

  return (
    <a href="" onClick={showCodeView} className={block}>
      Show Code
    </a>
  );

  function showCodeView(e) {
    e.preventDefault();
    e.stopPropagation();
    setActiveDialog(getCodeView(snapshot, file, line));
  }
}
