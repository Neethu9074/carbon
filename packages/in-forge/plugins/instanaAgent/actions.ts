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
      actionId: '761d8e94-0646-4563-a55e-fded58f3edf9',
      actionType: 'COMMAND',
      command: btoa(command),
      async: 'false',
      actionOperation: 'action.run'
    }
  });
}
