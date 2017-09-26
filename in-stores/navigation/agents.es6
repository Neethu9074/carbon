import { combineLatest } from 'reactive-observables';

import { buildPathStartsWithStream, buildUrlStream } from 'in-stores/navigation';

const agentNotificationsViewPath = '/agents/notifications';
export const agentNotificationsViewLink$ = buildUrlStream({
  path: agentNotificationsViewPath
});
export const isAgentNotificationsViewLink$ = buildPathStartsWithStream(agentNotificationsViewPath);

const agentViewPath = '/agents';
export const agentViewLink$ = buildUrlStream({
  path: agentViewPath
});
export const isAgentViewLink$ = combineLatest([
  buildPathStartsWithStream(agentViewPath),
  isAgentNotificationsViewLink$
]).map(([isAgentViewActive, isAgentNotificationsViewActive]) => {
  if (isAgentNotificationsViewActive) {
    return false;
  }
  return isAgentViewActive;
});
