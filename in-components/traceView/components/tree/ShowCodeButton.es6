import React from 'react';

import CodeRetrievalDialog from 'in-components/CodeRetrievalDialog';
import {setActiveDialog} from 'in-components/DialogPresenter/store';

import './ShowCodeButton.less';

const block = 'in-trace-view-show-code';

export default function ShowCodeButton({snapshot, file}) {
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
    setActiveDialog(<CodeRetrievalDialog snapshot={snapshot}
                                         file={file}
                                         lang='java' />);
  }
}
