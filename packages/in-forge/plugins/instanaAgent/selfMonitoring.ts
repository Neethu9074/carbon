/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createLogger } from '@instana/logger';

import createAgentResponseObservable from 'in-subscription/agentResponse';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

const logger = createLogger('in-forge/instanaAgent/selfMonitoring');

let curentClrStatus = true;

export function setMode(snapshot: SnapshotData, mode: number) {
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

export function setLogLevel(snapshot: SnapshotData, logLevel: string) {
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

export function resetAgent(snapshot: SnapshotData) {
  createAgentResponseObservable({
    action: 'agent.restart',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Agent reset response', response);
  });
}

export function resetSensors(snapshot: SnapshotData) {
  createAgentResponseObservable({
    action: 'sensors.reset',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Sensor reset response', response);
  });
}

export function updateAgent(snapshot: SnapshotData) {
  createAgentResponseObservable({
    action: 'agent.update',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Agent update response', response);
  });
}

export function updateConfiguration({
  volatileId,
  remoteName,
  remoteBranch,
  remoteUri
}: {
  volatileId: string;
  remoteName: string;
  remoteBranch: string;
  remoteUri: string;
}) {
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

export function rebootAgent(snapshot: SnapshotData) {
  createAgentResponseObservable({
    action: 'agent.reboot',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Agent reboot response', response);
  });
}

export function profileAgent(snapshot: SnapshotData) {
  createAgentResponseObservable({
    action: 'runAgentProfiler',
    target: snapshot.get('volatileId'),
    args: {}
  }).once(response => {
    logger.info('Agent Profiling response', response);
  });
}

export function listSensors(snapshot: SnapshotData) {
  return createAgentResponseObservable({
    action: 'agent.sensors.list',
    target: snapshot.get('volatileId'),
    args: {}
  }).map(response => response.data.sensors);
}

export function loadRawAgentConfiguration(snapshot: SnapshotData) {
  return createAgentResponseObservable({
    action: 'agent.config.raw',
    target: snapshot.get('volatileId'),
    args: {}
  });
}

export function loadDownloadableLogs([snapshot]: [snapshot: SnapshotData]) {
  return createAgentResponseObservable({
    action: 'agent.logs.list',
    target: snapshot.get('volatileId'),
    args: {}
  });
}

export function invokeLogCollectorPrepare(
  snapshot: SnapshotData,
  setPrepareClrLoggingEnvironmentButtonClick: React.Dispatch<React.SetStateAction<boolean>>
) {
  return createAgentResponseObservable({
    action: 'agent.clr.logs.prepare',
    target: snapshot['volatileId'],
    args: {}
  }).once(response => {
    if (response.data == 'Log Collector Finished') {
      setPrepareClrLoggingEnvironmentButtonClick(state => (state ? false : state));
    }
    logger.info('Log Collector Prepare response', response);
  });
}

export function isDotNetHostCollectorPrepared(
  snapshot: SnapshotData,
  clrLogState: boolean,
  setPrepareClrLoggingEnvironmentButtonClick: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (curentClrStatus != clrLogState) {
    snapshot['sensor_name'] = 'com.instana.agent';
    return createAgentResponseObservable({
      action: 'agent.clr.logs.status',
      target: snapshot,
      args: {}
    }).once(response => {
      logger.info('Log Collector Status', response);
      const validState = new Set(['true', 'false']);
      if(response.data){
        const status = JSON.parse((response.data ?? '').trim().toLowerCase());
        if (validState.has(response.data) && clrLogState !== status) {
          setPrepareClrLoggingEnvironmentButtonClick(() => (response.data === "true") );
          curentClrStatus = response.data;
        }
    }
    });
  }
  return null;
}
