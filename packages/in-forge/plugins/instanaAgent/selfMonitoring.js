import { createLogger } from '@instana/logger';

import createAgentResponseObservable from 'in-subscription/agentResponse';

const logger = createLogger('in-forge/instanaAgent/selfMonitoring');

export function setMode(snapshot, mode) {
  createAgentResponseObservable({
    action: 'agent.mode',
    target: snapshot.get('volatileId'),
    args: {
      mode: mode
    }
  }).once(response => {
    logger.info('Agent set mode response', response);
  });
}

export function setLogLevel(snapshot, logLevel) {
  createAgentResponseObservable({
    action: 'agent.log.level',
    target: snapshot.get('volatileId'),
    args: {
      level: logLevel
    }
  }).once(response => {
    logger.info('Agent set log level response', response);
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

export function updateAgent(snapshot) {
  createAgentResponseObservable({
    action: 'agent.update',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Agent update response', response);
  });
}

export function updateConfiguration({ volatileId, remoteName, remoteBranch, remoteUri }) {
  createAgentResponseObservable({
    action: 'agent.configuration.update',
    target: volatileId,
    args: {
      remoteName,
      remoteBranch,
      remoteUri
    }
  }).once(response => {
    logger.info('Agent Configuration response', response);
  });
}

export function rebootAgent(snapshot) {
  createAgentResponseObservable({
    action: 'agent.reboot',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Agent reboot response', response);
  });
}

export function listSensors(snapshot) {
  return createAgentResponseObservable({
    action: 'agent.sensors.list',
    target: snapshot.get('volatileId'),
    args: {}
  }).map(response => response.data.sensors);
}

export function loadRawAgentConfiguration(snapshot) {
  return createAgentResponseObservable({
    action: 'agent.config.raw',
    target: snapshot.get('volatileId'),
    args: {}
  });
}

export function loadDownloadableLogs([snapshot]) {
  return createAgentResponseObservable({
    action: 'agent.logs.list',
    target: snapshot.get('volatileId'),
    args: {}
  });
}
