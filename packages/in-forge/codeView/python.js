/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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
        action: 'python.source',
        target: snapshot.get('volatileId'),
        args: {
          file
        }
      })}
      lang="python"
    />
  );
}
