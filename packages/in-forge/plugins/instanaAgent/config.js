/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createLogger } from '@instana/logger';

import createAgentResponseObservable from 'in-subscription/agentResponse';

const logger = createLogger('in-forge/instanaAgent/config');

export function get(snapshot) {
  return createAgentResponseObservable({
    action: 'agent.config.get',
    target: snapshot.get('volatileId'),
    args: {}
  }).tap(response => {
    logger.info('Config get response', response);
  });
}

export function set(snapshot, config) {
  createAgentResponseObservable({
    action: 'agent.config.set',
    target: snapshot.get('volatileId'),
    args: {
      config
    }
  }).once(response => {
    logger.info('Config set response', response);
  });
}
