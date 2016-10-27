import logging from 'instalog';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';
import {goToDashboard} from 'in-stores/navigation/navigation';

const logger = logging.createLogger('in-forge/instanaAgent/selfMonitoring');

export function start(snapshot) {
  createAgentResponseObservable({
    action: 'agent.selfmonitoring.start',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Self monitoring start response', response);

    if (response.data) {
      goToDashboard(response.data);
    }
  });
}

export function stop(snapshot) {
  createAgentResponseObservable({
    action: 'agent.selfmonitoring.stop',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Self monitoring stop response', response);
  });
}

export function reset(snapshot) {
  createAgentResponseObservable({
    action: 'agent.reset',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Agent reset response', response);
  });
}
