import React from 'react';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';

import './ShowCodeButton.less';

const block = 'in-trace-view-show-code';

export default function ShowCodeButton({snapshot, file, line}) {
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
    console.log('Show code view for', snapshot.toJS(), file, line);

    createAgentResponseObservable({
      action: 'java.class',
      target: snapshot.get('volatileId'),
      args: {
        className: file
      }
    }).subscribe(response => {
      console.log('Got the following agent response', response);
    });
  }
}
