import logging from 'instalog';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';

const logger = logging.createLogger('in-forge/instanaAgent/selfMonitoring');

export function enable(snapshot) {
  createAgentResponseObservable({
    action: 'agent.selfmonitoring.start',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Self monitoring start response', response);
  });
}

export function disable(snapshot) {
  createAgentResponseObservable({
    action: 'agent.selfmonitoring.stop',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Self monitoring stop response', response);
  });
}
