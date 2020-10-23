import React from 'react';

import createAgentResponseObservable from 'in-subscription/agentResponse';
import CodeRetrievalDialog from 'in-sdk/components/CodeRetrievalDialog';

export function supportsCodeView() {
  return true;
}

export function getCodeView(snapshot, file, line) {
  return (
    <CodeRetrievalDialog
      snapshot={snapshot}
      file={file}
      line={line}
      agentResponse$={createAgentResponseObservable({
        action: 'php.source',
        target: snapshot.get('volatileId'),
        args: {
          file
        }
      })}
      lang="php"
    />
  );
}
