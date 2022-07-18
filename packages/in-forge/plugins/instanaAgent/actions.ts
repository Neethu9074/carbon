/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createAgentResponseObservable from 'in-subscription/agentResponse';

export function runAction3(command: any, volatileId: any) {
  return createAgentResponseObservable({
    action: 'action.run',
    target: volatileId,
    args: {
      actionId: 'e9ea042a-2d4c-486a-b6c9-cd3696d0a5b7',
      actionType: 'COMMAND',
      command: btoa(command),
      async: 'false',
      actionOperation: 'action.run'
    }
  });
}
