import React from 'react';

import './ShowCodeButton.less';

const block = 'in-trace-view-show-code';

export default function ShowCodeButton({snapshotId, file, line}) {
  return (
    <a href=''
       onClick={showCodeView}
       className={block}>
      Show Code
    </a>
  );

  function showCodeView(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Show code view for', snapshotId, file, line);
  }
}
