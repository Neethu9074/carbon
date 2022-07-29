/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm } from 'formalistic';

import createAgentResponseObservable from 'in-subscription/agentResponse';

export function runAction3(command: any, volatileId: MapForm) {
  return createAgentResponseObservable({
    action: 'action.run',
    target: volatileId,
    args: {
      actionType: 'COMMAND',
      command: btoa(command),
      async: 'false',
      actionOperation: 'action.run'
    }
  });
}
