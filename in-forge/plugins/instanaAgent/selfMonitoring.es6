import logging from 'instalog';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';
import {goToDashboard} from 'in-stores/navigation/navigation';

const logger = logging.createLogger('in-forge/instanaAgent/selfMonitoring');

export function start(snapshot, open) {
  createAgentResponseObservable({
    action: 'agent.selfmonitoring.start',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Self monitoring start response', response);

    if (open && response.data) {
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

export function setMode(snapshot, mode) {
  createAgentResponseObservable({
    action: 'agent.mode',
    target: snapshot.get('volatileId'),
    args: {
      'mode' : mode
    }
  }).once(response => {
    logger.info('Agent set mode response', response);
  });
}

export function resetAgent(snapshot) {
  createAgentResponseObservable({
    action: 'agent.restart',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Agent reset response', response);
  });
}

export function resetSensors(snapshot) {
  createAgentResponseObservable({
    action: 'sensors.reset',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Sensor reset response', response);
  });
}
