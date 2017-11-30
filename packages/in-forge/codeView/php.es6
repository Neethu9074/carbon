import React from 'react';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';
import CodeRetrievalDialog from 'in-components/CodeRetrievalDialog';

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
