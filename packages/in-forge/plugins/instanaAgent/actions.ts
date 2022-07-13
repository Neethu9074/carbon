/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createAgentResponseObservable from 'in-subscription/agentResponse';

export function runAction3(volatileId: any, command: any) {
  return createAgentResponseObservable({
    action: 'action',
    target: volatileId,
    args: {
      command: command
    }
  });
}
