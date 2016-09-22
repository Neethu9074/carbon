import React from 'react';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';
import CodeRetrievalDialog from 'in-components/CodeRetrievalDialog';


export function supportsCodeView() {
  return true;
}

export function getCodeView(snapshot, file) {
  return (
    <CodeRetrievalDialog snapshot={snapshot}
                         file={file}
                         agentResponse$={createAgentResponseObservable({
                           action: 'java.class',
                           target: snapshot.get('volatileId'),
                           args: {
                             className: file
                           }
                         })}
                         lang='java' />
  );
}
